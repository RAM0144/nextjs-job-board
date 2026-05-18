# Job Board Application

A full-stack Job Board platform built with Next.js, NextAuth, Prisma, PostgreSQL, and Tailwind CSS.

Users can browse and apply for jobs, while admins can manage job postings and application statuses.

---

# Features

## Authentication
- User Register & Login
- JWT Authentication
- Role-based Authorization
- Email Verification
- Forgot Password / Reset Password
- Protected Routes using Middleware

---

## User Features
- Browse all jobs
- Search jobs by title/company
- Filter jobs by type & location
- View job details
- Apply for jobs
- Upload resume link
- Track application status
- Withdraw application

---

## Admin Features
- Create job postings
- Edit jobs
- Delete jobs
- View applicants
- Update application status

Application flow:

PENDING
↓
REVIEWED
↓
SHORTLISTED
↓
HIRED / REJECTED

---

# Tech Stack

## Frontend
- Next.js
- React.js
- Tailwind CSS

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL

## Authentication
- NextAuth.js
- bcrypt

## Email Service
- Resend

---

# Folder Structure

src
│
├── app
│   │
│   ├── api
│   │   │
│   │   ├── auth
│   │   │   └── [...nextauth]
│   │   │       └── route.js
│   │   │
│   │   ├── register
│   │   │   └── route.js
│   │   │
│   │   ├── login
│   │   │   └── route.js
│   │   │
│   │   ├── verify-email
│   │   │   └── route.js
│   │   │
│   │   ├── forgot-password
│   │   │   └── route.js
│   │   │
│   │   ├── reset-password
│   │   │   └── route.js
│   │   │
│   │   ├── jobs
│   │   │   │
│   │   │   ├── route.js
│   │   │   │
│   │   │   │   GET
│   │   │   │   → Get all jobs
│   │   │   │
│   │   │   │   POST
│   │   │   │   → Admin creates job
│   │   │   │
│   │   │   └── [id]
│   │   │       └── route.js
│   │   │
│   │   │       GET
│   │   │       → Get single job
│   │   │
│   │   │       PUT
│   │   │       → Admin updates job
│   │   │
│   │   │       DELETE
│   │   │       → Admin deletes job
│   │   │
│   │   ├── applications
│   │   │   │
│   │   │   ├── route.js
│   │   │   │
│   │   │   │   POST
│   │   │   │   → User applies for job
│   │   │   │
│   │   │   │   GET
│   │   │   │   → Admin gets all applications
│   │   │   │
│   │   │   └── [id]
│   │   │       └── route.js
│   │   │
│   │   │       GET
│   │   │       → Get single application
│   │   │
│   │   │       PUT
│   │   │       → Admin updates application status
│   │   │
│   │   │       DELETE
│   │   │       → User withdraws application
│   │   │
│   │   ├── user
│   │   │   │
│   │   │   └── applications
│   │   │       └── route.js
│   │   │
│   │   │       GET
│   │   │       → Logged-in user's applications
│   │   │
│   │   └── admin
│   │       │
│   │       └── jobs
│   │           └── route.js
│   │
│   │           GET
│   │           → Admin posted jobs
│   │
│   ├── jobs
│   │   │
│   │   ├── page.js
│   │   │
│   │   └── [id]
│   │       └── page.js
│   │
│   ├── dashboard
│   │   │
│   │   ├── admin
│   │   │   └── page.js
│   │   │
│   │   └── user
│   │       └── page.js
│   │
│   ├── login
│   │   └── page.js
│   │
│   ├── register
│   │   └── page.js
│   │
│   ├── verify-email
│   │   └── page.js
│   │
│   ├── forgot-password
│   │   └── page.js
│   │
│   ├── reset-password
│   │   └── page.js
│   │
│   ├── admin
│   │   └── page.js
│   │
│   ├── layout.js
│   │
│   └── page.js
│
├── lib
│   │
│   ├── prisma.js
│   ├── mail.js
│   
│
├── prisma
│   │
│   ├── schema.prisma
│   └── migrations
│
└── proxy.js(Middleware)

# API Routes

## Jobs API

GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/[id]
PUT    /api/jobs/[id]
DELETE /api/jobs/[id]

---

## Applications API

POST   /api/applications
GET    /api/applications/[id]
PUT    /api/applications/[id]
DELETE /api/applications/[id]

---

## User API

GET /api/user/applications

---

# Database Schema

## User
- name
- email
- password
- role
- emailVerified

## Job
- title
- company
- location
- type
- salary
- description
- requirements

## Application
- status
- coverLetter
- resumeUrl

---

# Installation

## Clone Repository

```bash
git clone https://github.com/RAM0144/nextjs-job-board
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create `.env` file:

```env
DATABASE_URL=your_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
RESEND_API_KEY=your_api_key
```

---

# Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

# Run Development Server

```bash
npm run dev
```

---

# Email Verification

Email verification is implemented using Resend.

During development, auto-verification is enabled to allow testing without domain setup.

Users receive:
- Verification email after registration
- Password reset email during forgot password flow
- Application status update emails

---

# Security Features

- Password hashing using bcrypt
- JWT session authentication
- Protected API routes
- Middleware route protection
- Role-based access control
- Secure email verification tokens
- Secure password reset tokens

---

# Future Improvements

- Resume file upload
- Admin analytics dashboard
- Saved jobs
- Pagination
- Real-time notifications
- Company profiles
- Interview scheduling

---

# Author

Ramkumar — MERN Stack Developer