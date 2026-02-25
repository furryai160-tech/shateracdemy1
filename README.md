
# El Shate' Academy (LMS Platform)

A modern, scalable Learning Management System (LMS) built with **Next.js 14**, **NestJS**, **Prisma**, and **PostgreSQL**.

## 🚀 Features at a Glance

### 🎓 For Students
-   **Interactive Course Player**: Video lessons, quizzes, and text content.
-   **Drip Content**: Lessons unlock based on enrollment duration.
-   **Secure Video Playback**: Watermarked video player with anti-download protection.
-   **Progress Tracking**: Visual indicators of course completion.
-   **Certificates**: Auto-generated upon course completion.

### 👨‍🏫 For Instructors
-   **Course Builder**: Drag-and-drop curriculum management.
-   **Rich Text Editor**: Create engaging lesson descriptions.
-   **Video Uploads**: Support for Local, YouTube, Vdocipher, and Bunny.net.
-   **Student Analytics**: Track enrollment and progress.

### 🛡️ For Administrators
-   **Dashboard Overview**: Real-time stats on users, revenue, and active courses.
-   **User Management**: View and manage student/instructor accounts.
-   **Course Oversight**: Publish/Unpublish courses and monitor content.
-   **Role-Based Access Control**: Secure endpoints for Admin/Teacher specific actions.

### 💰 Commerce & Payments
-   **Stripe Integration**: Secure checkout for paid courses.
-   **Free Courses**: One-click enrollment for free content.
-   **Order via WhatsApp**: (Coming Soon) Alternative manual method.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS + Shadcn UI (inspired)
-   **State Management**: React Hooks & Context
-   **Animations**: Framer Motion
-   **Icons**: Lucide React

### Backend (API & Logic)
-   **Framework**: NestJS (Modular Architecture)
-   **Database ORM**: Prisma
-   **Database**: PostgreSQL
-   **Authentication**: Passport.js (JWT)
-   **File Uploads**: Multer (Local Storage)
-   **Payments**: Stripe SDK

---

## 🏗️ Project Structure

```bash
shater-academy/
├── backend/                # NestJS API
│   ├── prisma/             # Database Schema
│   ├── src/
│   │   ├── auth/           # Authentication (Login/Register)
│   │   ├── courses/        # Course Management
│   │   ├── lessons/        # Lesson Content
│   │   ├── enrollments/    # Student Progress
│   │   ├── admin/          # Admin Dashboard Logic
│   │   ├── payments/       # Stripe Integration
│   │   └── video/          # Secure Video Service
│   └── uploads/            # Local file storage (videos/images)
│
└── frontend/               # Next.js Application
    ├── src/
    │   ├── app/            # App Router Pages
    │   │   ├── (auth)/     # Login/Register Pages
    │   │   ├── dashboard/  # Instructor Dashboard
    │   │   ├── student/    # Student Dashboard
    │   │   ├── admin/      # Admin Console
    │   │   └── learn/      # Course Player
    │   └── components/     # Reusable UI Components
    └── public/             # Static Assets
```

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL
-   Stripe Account (for payments)

### 1. Setup Backend
```bash
cd backend
npm install

# Configure Environment Variables
cp .env.example .env
# Update DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY in .env

# Run Database Migrations
npx prisma migrate dev

# Start Server
npm run start:dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Configure Environment Variables
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_KEY

# Start Client
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🔐 Security Features

-   **Video Watermarking**: Displays user email/ID over video to deter screen recording.
-   **Signed URLs**: (Ready for implementation) For Vdocipher/Bunny integration.
-   **Role Guards**: `RolesGuard` ensures students cannot access admin/teacher routes.
-   **Input Validation**: DTOs validation with `class-validator`.

---

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
