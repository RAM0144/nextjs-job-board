# Job Board Application

A full-stack Job Board platform built with Next.js, NextAuth, Prisma, PostgreSQL, and Tailwind CSS.

The platform allows job seekers to browse and apply for jobs while enabling administrators to manage job postings, applications, and hiring workflows.

---

# Features

## Authentication
- User Register & Login
- JWT Authentication
- Role-based Authorization (Admin/User)
- Email Verification
- Forgot Password & Reset Password
- Protected Routes using Middleware
- Password Hashing with bcrypt

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

## Email Notifications

The platform uses SMTP (Nodemailer) to send automated emails for:

Email Verification
Password Reset Requests
Application Submission Confirmation
Application Status Updates

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
- Nodemailer (SMTP)

## Database
- PostgreSQL (Supabase)
- Prisma ORM

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
- id
- name
- email
- password
- role
- emailVerified
- verifyToken
- verifyTokenExpiry
- resetToken
- resetTokenExpiry
- createdAt
- updatedAt

## Job
- id
- title
- company
- location
- type
- salary
- description
- requirements
- createdAt
- updatedAt

## Application
- id
- status
- coverLetter
- resumeUrl
- userId
- jobId
- createdAt
- updatedAt

---

# Installation

## Clone Repository

git clone https://github.com/RAM0144/nextjs-job-board


## Install Dependencies

npm install

## Setup Environment Variables

Create `.env` file:

- DATABASE_URL=your_supabase_database_url 
- DIRECT_URL=your_supabase_direct_url 

- NEXTAUTH_URL=your_domain_url 
- NEXTAUTH_SECRET=your_secret 

- EMAIL_HOST=smtp.gmail.com 
- EMAIL_PORT=587 
- EMAIL_USER=your_email@gmail.com 
- EMAIL_PASS=your_app_password 
- EMAIL_FROM=your_email@gmail.com

---

# Prisma Setup

npx prisma generate
npx prisma migrate dev

---

# Run Development Server

npm run dev

---

# Email Verification

Email functionality is implemented using SMTP (Nodemailer).

Users receive:

* Verification emails after registration
* Password reset emails during the forgot password flow
* Application confirmation emails after applying for a job
* Application status update emails (Reviewed, Shortlisted, Rejected, Hired)

Emails are sent securely using SMTP credentials configured through environment variables.

---

# Security Features

- Password hashing using bcrypt
- JWT session authentication
- Protected API routes
- Middleware route protection
- Role-based access control
- Secure email verification tokens
- Secure password reset tokens
- Server-side authorization checks

---

# Future Improvements

- Resume file upload
- Admin analytics dashboard
- Saved jobs feature
- Pagination
- Real-time notifications
- Company profiles
- Interview scheduling
- Job bookmarking

---

# Author

Ramkumar — MERN Stack Developer| Next.js Developer