# SafeCampus KE - Anonymous Digital GBV Reporting Platform

## 🎯 About
SafeCampus KE is an anonymous reporting and support platform for digital gender-based violence in Kenyan universities. Built for the **16 Days of Activism against Gender-Based Violence** (25 Nov - 10 Dec 2024), focusing on the theme "UNiTE to End Digital Violence Against All Women and Girls."

## ✨ Features
- **Anonymous Reporting**: Report digital GBV incidents without revealing identity
- **Immediate Guidance**: Get instant, actionable advice based on incident type
- **Resource Directory**: Access emergency contacts, support organizations, and campus services
- **Digital Safety Tips**: Learn how to protect yourself online
- **Admin Dashboard**: View aggregated, anonymized statistics (password: admin2024)
- **Mobile-First Design**: Optimized for smartphones, works as PWA

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB instance (local or Atlas)

### Installation

1. **Install frontend dependencies**:
```bash
npm install
```

2. **Configure backend & database**:
```bash
cd backend
npm install
cp .env.example .env
```
   - Set `MONGODB_URI` in `backend/.env` to your MongoDB connection string
   - Optionally adjust `PORT` (default: 4000)

3. **Run backend server**:
```bash
cd backend
npm start
```

4. **Run development frontend** (from project root):
```bash
npm run dev
```
The app will open at http://localhost:5173. API calls to `/api/*` are proxied to the backend.

5. **Build frontend for production**:
```bash
npm run build
```

## 📱 Key Pages

- **Home** (`/`): Landing page with campaign info
- **Report** (`/report`): Anonymous incident reporting form
- **Resources** (`/resources`): Emergency contacts, safety tips, support services
- **Admin** (`/admin`): Statistics dashboard (password: admin2024)

## 🛡️ Security & Privacy

- No personal information collected
- Anonymous client identifiers only (no real identities)
- Reports encrypted in transit
- Admin view shows only aggregated data
- Evidence uploads stored securely on the backend server

## 📊 Admin Access
Default password: `admin2024`
(Change this in production!)

## 🎨 Tech Stack
- React 18 + Vite
- TailwindCSS + shadcn/ui components
- Node.js + Express + MongoDB (reports storage & statistics API)
- React Router
- Recharts for data visualization
- PWA-ready with Vite PWA plugin

## 🤝 Contributing
This project was created by **Immanuel K. Ronoh** (3rd Year, Egerton University) for the 16 Days of Activism 2024.

## 📞 Emergency Contacts
- Police: 999 or 112
- GBV Hotline: 1195 (free, 24/7)
- Healthcare: 1199

## 📄 License
MIT License - Use freely for social impact

## 🙏 Acknowledgments
- UN Women for the 16 Days campaign
- Egerton University Institute of Women, Gender & Development Studies
- All survivors and advocates working to end GBV

---
**Remember**: If you're in immediate danger, call 999. You're not alone. 💜
