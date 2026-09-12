# ASTRA IETM Confidential Grievance Portal

Modern, secure, and responsive web application for the **Cyber Security Department Association** of **KMCT Institute of Engineering and Technology** (`grievance.astraietm.in`).

This application provides a confidential grievance submission and tracking portal with Google OAuth identity verification, strict identity isolation from grievance reviewers, role-based access control (RBAC), administrative audit logging, status tracking, file attachment handling, and rate limiting.

---

## 🚀 Features

- 🔒 **Confidential Grievance Portal**: Google OAuth authentication verifies student/member identity while keeping it strictly hidden from grievance reviewers.
- 🛡️ **Role-Based Access Control (RBAC)**:
  - **`USER`**: Submits grievances, tracks status via `GRV-2026-XXXX`, views personal dashboard.
  - **`REVIEWER`**: Reviews grievance content, updates status, adds internal notes, publishes responses. Identity remains restricted (`Identity: Restricted`).
  - **`ADMIN`**: Manages categories, reviewers, and operational metrics. Identity remains restricted.
  - **`SUPER_ADMIN`**: Full administrative oversight with audit-logged identity reveal capabilities.
- 📜 **Audit Logging**: Mandatory justification reason required for `SUPER_ADMIN` identity unlocks, permanently recorded in `IdentityAccessLog`.
- 🔎 **Public Grievance Tracking**: Search status by unique reference ID (`GRV-2026-0001`) with timeline progression without exposing complainant details.
- 📁 **Secure Attachment Uploads**: Validated file uploads (PDF, Images, DOCX, TXT, ZIP up to 10MB) stored securely with server-side authorization checks preventing IDOR.
- 🎨 **Modern Cybersecurity Aesthetic**: Dark navy/slate design system, responsive drawer menu, glassmorphic cards, and status badges.

---

## 🛠️ Local Development Setup

### Prerequisites

- Node.js v18+ or v20+
- npm v9+ or pnpm

### 1. Clone & Install Dependencies

```bash
cd "astra grievance"
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="astra_super_secret_jwt_key_2026_dev_secret_key_89237482"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_ALLOWED_DOMAIN=""
ENABLE_DEV_LOGIN="true"
```

### 3. Initialize Database & Seed

Push the Prisma schema to SQLite and seed initial categories and test accounts:

```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Test Accounts (Dev Mode)

When `ENABLE_DEV_LOGIN="true"`, you can sign in using password `AstraSecure2026!`:

| Role | Email | Password |
|---|---|---|
| **SUPER_ADMIN** | `admin@astraietm.in` | `AstraSecure2026!` |
| **REVIEWER** | `reviewer@astraietm.in` | `AstraSecure2026!` |
| **USER (Student)** | `student@astraietm.in` | `AstraSecure2026!` |

---

## 🌐 Google OAuth 2.0 Production Setup

1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a new project named `ASTRA-Grievance-Portal`.
3. Navigate to **APIs & Services > OAuth consent screen**:
   - Choose User Type: **Internal** (if restricting to Google Workspace domain) or **External**.
   - Fill App Name: `ASTRA IETM Confidential Grievance Portal`.
   - Authorized domain: `astraietm.in`.
4. Navigate to **Credentials > Create Credentials > OAuth client ID**:
   - Application type: **Web application**.
   - Authorized JavaScript origins: `https://grievance.astraietm.in`
   - Authorized redirect URIs: `https://grievance.astraietm.in/api/auth/callback/google`
5. Copy the Client ID and Client Secret into your `.env` or production secrets manager:

```env
GOOGLE_CLIENT_ID="XXXXXX.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-XXXXXX"
GOOGLE_ALLOWED_DOMAIN="kmct.edu.in" # Optional: Restrict to institutional email domain
ENABLE_DEV_LOGIN="false"            # Enforce Google OAuth only in production
```

---

## 👤 Creating a SUPER_ADMIN Account

To grant `SUPER_ADMIN` privileges to an existing user:

### Method A: Via Database CLI / Prisma Studio

```bash
npx prisma studio
```

Navigate to `User`, locate the email address, and change `role` to `SUPER_ADMIN`.

### Method B: Via Node.js Script

```bash
npx tsx -e '
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
await prisma.user.update({
  where: { email: "target-user@kmct.edu.in" },
  data: { role: "SUPER_ADMIN" }
});
console.log("SUPER_ADMIN role assigned successfully.");
'
```

---

## 📦 Production Deployment Guide (`grievance.astraietm.in`)

### 1. PostgreSQL Database Configuration

In production, update `DATABASE_URL` in `.env` to point to your PostgreSQL database:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/astra_grievance?schema=public"
```

In `prisma/schema.prisma`, change provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Run migration:

```bash
npx prisma migrate deploy
npm run db:seed
```

### 2. Build Next.js Application

```bash
npm run build
```

### 3. Process Management (PM2)

Start the production server using PM2:

```bash
npm install -g pm2
pm2 start npm --name "astra-grievance" -- start
pm2 save
pm2 startup
```

### 4. NGINX Reverse Proxy Configuration

Configure NGINX for `grievance.astraietm.in`:

```nginx
server {
    listen 80;
    server_name grievance.astraietm.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name grievance.astraietm.in;

    ssl_certificate /etc/letsencrypt/live/grievance.astraietm.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grievance.astraietm.in/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 12M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Certificate Setup (Certbot)

```bash
sudo certbot --nginx -d grievance.astraietm.in
```

---

## 🔒 Security Checklist

- [x] **HTTPS Only**: Enforced via Next.js security headers & NGINX HSTS.
- [x] **Server-Side Authorization**: Verified on server API routes for all sensitive operations.
- [x] **IDOR Prevention**: Grievance ownership and attachment downloads verified via server checks.
- [x] **Rate Limiting**: Applied to submission and tracking endpoints.
- [x] **Input Validation & Sanitization**: Zod schemas & XSS string sanitization.
- [x] **File Upload Validation**: Size limits (10MB) & MIME type sanitization.
- [x] **HttpOnly Cookies**: NextAuth JWT session with SameSite configuration.
- [x] **Audit Trail**: `IdentityAccessLog` table tracks all SUPER_ADMIN identity views.
- [x] **No Secrets in Frontend**: OAuth secrets & DB URIs restricted to server environment.

---

## 📄 License & Organization Info

**ASTRA IETM** • Cyber Security Department Association  
KMCT Institute of Engineering and Technology, Kozhikode, Kerala  
Website: [https://grievance.astraietm.in](https://grievance.astraietm.in)
