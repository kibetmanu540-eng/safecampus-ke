import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI is not set. Please define it in backend/.env before running this script.');
  process.exit(1);
}

const adminSeedEmail = process.env.ADMIN_SEED_EMAIL || 'admin@safecampus.ke';
const adminSeedPassword = process.env.ADMIN_SEED_PASSWORD || 'admin2024';
const adminSeedUniversity = process.env.ADMIN_SEED_UNIVERSITY || 'egerton';

if (!process.env.ADMIN_SEED_EMAIL || !process.env.ADMIN_SEED_PASSWORD || !process.env.ADMIN_SEED_UNIVERSITY) {
  console.log('Using default admin seed credentials (admin@safecampus.ke / admin2024 / egerton). For production, set ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD, and ADMIN_SEED_UNIVERSITY in backend/.env.');
}

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  university: { type: String, required: true },
  role: { type: String, enum: ['admin', 'viewer'], default: 'admin' }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

const run = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const existing = await AdminUser.findOne({ email: adminSeedEmail }).exec();
    if (existing) {
      console.log(`Admin user with email ${adminSeedEmail} already exists.`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminSeedPassword, 10);

    const admin = await AdminUser.create({
      email: adminSeedEmail,
      passwordHash,
      university: adminSeedUniversity,
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  University: ${admin.university}`);
    console.log(`  Role: ${admin.role}`);

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user', err);
    process.exit(1);
  }
};

run();
