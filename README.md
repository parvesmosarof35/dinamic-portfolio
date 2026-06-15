# 🚀 Premium Dynamic Full-Stack Developer Portfolio & Admin Dashboard

A state-of-the-art, fully dynamic Full-Stack Developer Portfolio and LMS/Blog system, complete with a secure Admin Dashboard. Built using **Next.js 16**, **TypeScript**, **MongoDB**, **Tailwind CSS**, and **Framer Motion**.

The entire portfolio contents—from personal biography, timeline entries, skill categories, projects, testimonials, calendar bookings, inbox messages, to blog posts and learning materials—can be customized dynamically in real-time from the built-in Admin panel.

---

## ✨ Key Features

*   **📱 Fully Responsive Glassmorphic UI**: Beautiful premium styling designed using Tailwind CSS, including a custom dark/light theme engine, smooth page transitions, and micro-interactions.
*   **🔒 Secure Admin Dashboard (`/admin`)**: Real-time CRUD operations for every single website component. Access controls are protected via Next.js Edge-compatible route proxy guards and cookie-based JWT authorization.
*   **📅 Interactive Calendar Booking**: Direct inline scheduling widget. Clients can inspect real-time slot availability, submit appointment requests with an agenda, and receive email notifications.
*   **✍️ Blog & LMS/Learnings Modules**: Complete CMS for writing markdown-supported blogs and structuring learning guides with dynamic category sidebars.
*   **☁️ Direct Cloudinary Upload**: Effortless image uploads integrated via base64 API route handlers directly to Cloudinary.
*   **🚀 Automated Database Seeding**: Automatic seeding of the super admin credentials upon the first build or startup.
*   **🔍 SEO-Optimized**: Native dynamic XML sitemap configuration (`sitemap.xml`) matching database items alongside automated crawler rules (`robots.txt`).

---

## 🛠️ Tech Stack

*   **Core**: Next.js 16 (App Router + Turbopack), React, TypeScript
*   **Styling & Motion**: Tailwind CSS, Framer Motion, Lucide Icons, Sonner
*   **Database & ORM**: MongoDB, Mongoose
*   **Authentication**: JSON Web Tokens (JWT), HTTP-Only Cookies, BCrypt.js
*   **Email & Storage**: Nodemailer (SMTP), Cloudinary API
*   **Form Management**: React Hook Form, Zod
*   **State Management**: TanStack React Query

---

## ⚙️ Environment Variables Configuration

To run this project, you need to configure the following environment variables. Create a file named `.env.local` in the root of the project:

```env
# Server Config
PORT=3000
NODE_ENV=development

# Database Config
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security Config (Generate strong random strings)
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_jwt_access_secret_key
EXPIRES_IN=10d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
REFRESH_EXPIRES_IN=30d

# Email Config (Gmail SMTP)
NODEMAILER_EMAIL=your_gmail@gmail.com
NODEMAILER_PASSWORD=your_gmail_app_password

# Database Seeding (Default Admin Credentials created on first build)
SUPER_ADMIN_EMAIL=parvesmosarof2@gmail.com
SUPER_ADMIN_PASS=123456

# SEO & Sitemap Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> [!TIP]
> For Gmail SMTP support, generate an **App Password** from your Google Account settings rather than using your main account password.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/parvesmosarof35/dinamic-portfolio.git
cd dinamic-portfolio/devparves
```

### 2. Install Dependencies
```bash
# Using pnpm (Recommended)
pnpm install

# Or using npm
npm install
```

### 3. Run Development Server
```bash
pnpm dev
# or
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### 4. Build for Production
```bash
pnpm build
# or
npm run build
```

---

## 🔒 Accessing the Admin Panel

The database seeding script runs automatically on build/startup. Once the server is running:

1. Navigate to: **[http://localhost:3000/login](http://localhost:3000/login)**
2. Enter the default administrator credentials configured in your `.env.local`:
   * **Email:** `parvesmosarof2@gmail.com`
   * **Password:** `123456`
3. You will be redirected to **`/admin`** where you can configure your profile, update social links, upload a CV, and manage all your portfolio assets.

---

## 🌐 Deployment to Vercel

1. Push your repository to your GitHub account.
2. Link your repository in Vercel and create a new project.
3. In **Project Settings > Environment Variables**, copy and paste all the variables listed in your `.env.local`.
4. Update `NEXT_PUBLIC_SITE_URL` to point to your live Vercel domain (e.g. `https://your-domain.vercel.app`) to support active dynamic sitemap generation.
5. Click **Deploy**. Vercel will build the assets, connect to your MongoDB cluster, seed your super admin user, and serve your live website!
