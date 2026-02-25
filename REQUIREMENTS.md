# 🎓 El Shate' Academy (الشاطر أكاديمي)

## نظرة عامة
منصة SaaS تعليمية متكاملة توفر خدمة "الأكاديمية كخدمة" للمدرسين، تشمل استوديو تصوير احترافي، مونتاج، ومنصة ويب مخصصة.

## 🚀 المميزات الرئيسية

### 1. البنية التحتية (The Engine)
- **Framework**: Next.js 14+ (Frontend) + NestJS (Backend)
- **Database**: PostgreSQL مع Row-Level Security (RLS)
- **Multi-tenancy**: عزل كامل للبيانات بين المدرسين
- **Domain Management**: 
  - نطاقات فرعية تلقائية: `teacher-name.elshate.academy`
  - ربط نطاقات مخصصة عبر Cloudflare API
  - SSL تلقائي

### 2. العلامة التجارية والواجهة (The Identity)
- **White-Labeling**: تخصيص كامل للألوان، الشعار، والخطوط
- **3 قوالب UI**: Modern, Professional, Dark
- **صفحة هبوط احترافية** للمنصة الرئيسية

### 3. حماية وبث الفيديو (The Security)
- **VOD**: تشفير DRM عبر Vdocipher/Bunny.net
- **Live Streaming**: Amazon IVS للبث المباشر
- **Anti-Piracy**:
  - Watermark ديناميكي (اسم + رقم الطالب)
  - تشفير HLS لمنع التحميل
  - منع تسجيل الشاشة

### 4. النظام المالي (The Cashier)
- **Payment Gateways**: Paymob, Fawry, Instapay
- **Wallet System**: محفظة رقمية للمدرسين
- **Promo Codes**: توليد أكواد خصم جماعية

### 5. الوحدات التعليمية (The Product)
- **Smart Quiz Engine**: اختبارات ذكية مع Focus Lock
- **Drip Content**: فتح الدروس بالتسلسل
- **Certificates**: شهادات PDF تلقائية

### 6. لوحات التحكم (The Control)
- **Super Admin**: إدارة كاملة للمنصة
- **Teacher Admin**: إدارة الطلاب والمحتوى

## 📁 هيكل المشروع

```
SHATER/
├── frontend/          # Next.js 14 Application
│   ├── src/
│   │   ├── app/      # App Router Pages
│   │   ├── components/ # React Components
│   │   └── lib/      # Utilities
│   └── package.json
├── backend/          # NestJS API
│   ├── src/
│   │   ├── courses/
│   │   ├── users/
│   │   ├── tenants/
│   │   └── modules/
│   └── package.json
├── .env.example      # Environment Variables Template
├── setup.bat         # Setup Script
└── start-dev.bat     # Development Server Launcher
```

## 🛠️ التثبيت والتشغيل

### المتطلبات
- Node.js 18+ و npm
- PostgreSQL 14+
- Git

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd SHATER
```

2. **تثبيت الحزم**
```bash
# طريقة سريعة (Windows)
setup.bat

# أو يدوياً
cd frontend && npm install
cd ../backend && npm install
```

3. **إعداد قاعدة البيانات**
```bash
# إنشاء قاعدة بيانات PostgreSQL
createdb elshate_academy

# تشغيل Migrations (قريباً)
cd backend
npm run migration:run
```

4. **إعداد متغيرات البيئة**
```bash
# نسخ ملف البيئة
cp .env.example backend/.env

# تعديل القيم حسب بيئتك
```

5. **تشغيل المشروع**
```bash
# طريقة سريعة (Windows)
start-dev.bat

# أو يدوياً
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run start:dev
```

## 🌐 الوصول للتطبيق

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api (قريباً)

## 📄 الصفحات المتاحة

- `/` - الصفحة الرئيسية
- `/login` - تسجيل الدخول
- `/register` - إنشاء حساب جديد
- `/dashboard` - لوحة التحكم (قريباً)

## 🎨 التقنيات المستخدمة

### Frontend
- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **NestJS** - Node.js Framework
- **TypeORM/Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Passport** - Auth Strategy

### Infrastructure
- **Docker** - Containerization (قريباً)
- **Cloudflare** - CDN & DNS
- **AWS S3** - File Storage
- **Amazon IVS** - Live Streaming

## 🔐 الأمان

- Row-Level Security (RLS) في PostgreSQL
- JWT Authentication
- CORS Protection
- Rate Limiting
- Input Validation
- SQL Injection Prevention

## 📊 خارطة الطريق

### Phase 1: Core Platform 🏗️
- [x] Project Setup (Backend + Frontend)
- [x] Landing Page (Skeleton)
- [x] Auth Pages (Login/Register)
- [x] Basic UI Components (Shadcn/UI + Framer Motion)
- [x] Course Listing & Detail Pages (Frontend)

### Phase 2: Authentication & Multi-tenancy
- [x] JWT Authentication
- [x] User Management
- [x] Tenant Isolation (RLS)
- [ ] Domain Management

### Phase 3: Course Management
- [x] Course CRUD
- [x] Lesson Management
- [x] Quiz Engine
- [ ] Drip Content Logic

### Phase 4: Video & Security 🎥
- [ ] Vdocipher/Bunny Integration (Stubbed/Prepared)
- [ ] Secure Playback Implementation (OTP generation)
- [ ] Content Protection Logic
- [ ] Anti-Screen Recording (Metadata/Watermark Logic)

### Phase 5: Payments 💰
- [ ] Stripe/Paymob Integration (Stripe Implemented)
- [ ] Checkout Sessions
- [ ] Webhook Handling
- [ ] Wallet System
- [ ] Promo Codes

### Phase 6: Admin Dashboards 📊
- [ ] Super Admin Panel (API Ready)
- [ ] Teacher Dashboard (API Ready)
- [ ] Analytics & Reports (API Implemented)
- [ ] Student Management (API Ready)
