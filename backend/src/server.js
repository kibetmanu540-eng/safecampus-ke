import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import job from './config/cron.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;
const adminJwtSecret = process.env.ADMIN_JWT_SECRET;
const MAX_EVIDENCE_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, `evidence-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: MAX_EVIDENCE_FILE_SIZE_BYTES },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

if (!mongoUri) {
  console.error('MONGODB_URI is not set. Please create backend/.env and define MONGODB_URI to your MongoDB/Atlas connection string.');
  process.exit(1);
} else {
  console.log('MONGODB_URI loaded from environment (using external MongoDB instance).');
}

if (!adminJwtSecret) {
  console.error('ADMIN_JWT_SECRET is not set. Please define ADMIN_JWT_SECRET in backend/.env for admin authentication.');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  university: { type: String },
  description: { type: String, required: true },
  evidenceUrl: { type: String },
  evidenceUrls: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'new' },
  clientId: { type: String, default: 'anonymous' },
  platform: { type: String, default: '' },
  platformProfile: { type: String, default: '' },
  suspectName: { type: String, default: '' },
  suspectUsername: { type: String, default: '' },
  suspectContact: { type: String, default: '' },
  incidentDate: { type: String, default: '' },
  incidentLocation: { type: String, default: '' },
  witnesses: { type: String, default: '' },
  victimContact: { type: String, default: '' },
  adminNotes: { type: String, default: '' }
});

const Report = mongoose.model('Report', reportSchema);

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  university: { type: String, required: true },
  role: { type: String, enum: ['admin', 'viewer'], default: 'admin' }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

const createAdminToken = (admin) => {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email,
      university: admin.university,
      role: admin.role
    },
    adminJwtSecret,
    { expiresIn: '8h' }
  );
};

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (!token || scheme !== 'Bearer') {
    return res.status(401).json({ message: 'Admin authentication required' });
  }

  try {
    const payload = jwt.verify(token, adminJwtSecret);
    const admin = await AdminUser.findById(payload.sub).lean();

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin token' });
    }

    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
      university: admin.university,
      role: admin.role
    };

    next();
  } catch (err) {
    console.error('Error verifying admin token', err);
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const admin = await AdminUser.findOne({ email }).exec();

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createAdminToken(admin);

    return res.json({
      token,
      admin: {
        email: admin.email,
        university: admin.university,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Error during admin login', err);
    return res.status(500).json({ message: 'Failed to login' });
  }
});

app.get('/api/admin/me', requireAdmin, async (req, res) => {
  return res.json({ admin: req.admin });
});

app.post('/api/reports', upload.array('evidence', 5), async (req, res) => {
  try {
    const {
      type,
      university,
      description,
      status,
      clientId,
      platform,
      platformProfile,
      suspectName,
      suspectUsername,
      suspectContact,
      incidentDate,
      incidentLocation,
      witnesses,
      victimContact,
    } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: 'type and description are required' });
    }

    let evidenceUrl = null;
    let evidenceUrls = [];

    if (Array.isArray(req.files) && req.files.length > 0) {
      evidenceUrls = req.files.map((file) => `/uploads/${file.filename}`);
      evidenceUrl = evidenceUrls[0];
    }

    const report = await Report.create({
      type,
      university: university || 'not_specified',
      description,
      evidenceUrl,
      evidenceUrls,
      status: status || 'new',
      clientId: clientId || 'anonymous',
      platform: platform || '',
      platformProfile: platformProfile || '',
      suspectName: suspectName || '',
      suspectUsername: suspectUsername || '',
      suspectContact: suspectContact || '',
      incidentDate: incidentDate || '',
      incidentLocation: incidentLocation || '',
      witnesses: witnesses || '',
      victimContact: victimContact || ''
    });

    return res.status(201).json({ id: report._id });
  } catch (err) {
    console.error('Error creating report', err);
    return res.status(500).json({ message: 'Failed to create report' });
  }
});

app.patch('/api/reports/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const update = {};
    if (typeof status === 'string' && status.trim()) {
      update.status = status.trim();
    }
    if (typeof adminNotes === 'string') {
      update.adminNotes = adminNotes;
    }

    const report = await Report.findByIdAndUpdate(id, update, { new: true });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.json({
      id: report._id.toString(),
      status: report.status,
      adminNotes: report.adminNotes || ''
    });
  } catch (err) {
    console.error('Error updating report', err);
    return res.status(500).json({ message: 'Failed to update report' });
  }
});

app.delete('/api/reports/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id).exec();

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const evidenceUrls = Array.isArray(report.evidenceUrls) && report.evidenceUrls.length > 0
      ? report.evidenceUrls
      : (report.evidenceUrl ? [report.evidenceUrl] : []);

    evidenceUrls.forEach((url) => {
      if (typeof url === 'string' && url.startsWith('/uploads/')) {
        const filename = path.basename(url);
        const filePath = path.join(uploadsDir, filename);

        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting evidence file', err);
          }
        });
      }
    });

    await Report.deleteOne({ _id: id });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting report', err);
    return res.status(500).json({ message: 'Failed to delete report' });
  }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ timestamp: 1 }).lean();

    const totalReports = reports.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const reportsThisWeek = reports.filter((r) => r.timestamp >= oneWeekAgo).length;

    const typeGroups = {};
    const uniGroups = {};

    for (const r of reports) {
      const type = r.type || 'other';
      typeGroups[type] = (typeGroups[type] || 0) + 1;

      const uni = r.university || 'not_specified';
      uniGroups[uni] = (uniGroups[uni] || 0) + 1;
    }

    const reportsByType = Object.entries(typeGroups).map(([name, value]) => ({
      name: name.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value
    }));

    const reportsByUniversity = Object.entries(uniGroups).map(([name, value]) => ({
      name: name === 'not_specified' ? 'Not Specified' : name.toUpperCase(),
      value
    }));

    const recentReports = reports.slice(-5).reverse().map((r) => ({
      id: r._id.toString(),
      type: r.type,
      university: r.university,
      description: r.description,
      evidenceUrl: r.evidenceUrl,
      evidenceUrls: r.evidenceUrls || [],
      status: r.status,
      platform: r.platform,
      platformProfile: r.platformProfile,
      suspectName: r.suspectName,
      suspectUsername: r.suspectUsername,
      suspectContact: r.suspectContact,
      incidentDate: r.incidentDate,
      incidentLocation: r.incidentLocation,
      witnesses: r.witnesses,
      victimContact: r.victimContact,
      adminNotes: r.adminNotes,
      timestamp: r.timestamp
    }));

    return res.json({
      totalReports,
      reportsThisWeek,
      reportsByType,
      reportsByUniversity,
      recentReports
    });
  } catch (err) {
    console.error('Error fetching admin stats', err);
    return res.status(500).json({ message: 'Failed to load statistics' });
  }
});

app.get('/api/admin/reports', requireAdmin, async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ timestamp: -1 }).lean();

    const mapped = reports.map((r) => ({
      id: r._id.toString(),
      type: r.type,
      university: r.university,
      description: r.description,
      evidenceUrl: r.evidenceUrl,
      evidenceUrls: r.evidenceUrls || [],
      status: r.status,
      platform: r.platform,
      platformProfile: r.platformProfile,
      suspectName: r.suspectName,
      suspectUsername: r.suspectUsername,
      suspectContact: r.suspectContact,
      incidentDate: r.incidentDate,
      incidentLocation: r.incidentLocation,
      witnesses: r.witnesses,
      victimContact: r.victimContact,
      adminNotes: r.adminNotes,
      timestamp: r.timestamp,
    }));

    return res.json({ reports: mapped });
  } catch (err) {
    console.error('Error fetching all reports', err);
    return res.status(500).json({ message: 'Failed to load reports' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  try {
    if (process.env.API_URL) {
      job.start();
      console.log('Keep-alive cron job started');
    } else {
      console.warn('API_URL is not set; keep-alive cron job not started');
    }
  } catch (err) {
    console.error('Failed to start keep-alive cron job', err);
  }
});
