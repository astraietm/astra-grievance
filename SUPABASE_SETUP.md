# Supabase Database & Vercel Deployment Guide

This guide details how to set up **Supabase PostgreSQL Database** and deploy the **ASTRA Grievance Portal** on **Vercel**.

---

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and log in or create an account.
2. Click **New Project** and name it (e.g. `astra-grievance`).
3. Set a strong **Database Password** (save this password safely!).
4. Choose your region (e.g. AWS / nearest region).

---

## 2. Get Supabase Connection Strings & API Keys

Navigate to your Supabase Project Dashboard:

### Database Connection Strings
Go to **Project Settings** -> **Database**:

1. **Transaction Pooler Connection String (Port 6543)** -> Used for `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
2. **Direct Connection String (Port 5432)** -> Used for `DIRECT_URL`:
   ```env
   DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ```

> **Why two URLs on Vercel?**
> Vercel executes serverless API routes. `DATABASE_URL` (Port 6543 + PgBouncer) manages connection pooling to avoid database connection exhaustion. `DIRECT_URL` (Port 5432) is used by Prisma CLI during migrations and builds.

### Supabase API Keys
Go to **Project Settings** -> **API**:
- **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
- **anon key (public)**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key (secret)**: `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Push Database Schema to Supabase

Run the following commands in your local workspace terminal:

```bash
# Generate Prisma Client for PostgreSQL
npx prisma generate

# Push Prisma Schema to Supabase PostgreSQL
npm run db:push

# Seed categories and initial admin accounts into Supabase
npm run db:seed
```

---

## 4. Configure Supabase Storage (Optional for Attachments)

1. In Supabase Dashboard, go to **Storage** -> **Create a new bucket**.
2. Name the bucket `grievance-attachments`.
3. Toggle **Private** (recommended for confidential grievance uploads).
4. If you leave `SUPABASE_SERVICE_ROLE_KEY` set, server-side API routes will upload directly to Supabase Storage.

---

## 5. Deploy on Vercel

1. Push your code to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `astra-grievance` repository.
4. Expand **Environment Variables** and add the following:

| Key | Description | Example / Value |
|---|---|---|
| `DATABASE_URL` | Supabase Pooler URL | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase Direct URL | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Service Role Key | `eyJhbG...` |
| `NEXTAUTH_URL` | Production Domain | `https://your-app-name.vercel.app` |
| `NEXTAUTH_SECRET` | Auth JWT Secret Key | Random 32+ character string |
| `ENABLE_DEV_LOGIN` | Disable Dev Bypass | `false` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | `GOCSPX-xxx` |
| `GOOGLE_ALLOWED_DOMAIN` | Restricted Domain | `kmct.edu.in` (optional) |

5. Click **Deploy**. Vercel will run `prisma generate && next build` automatically during deployment.

---

## Troubleshooting

- **Connection limit reached**: Make sure `DATABASE_URL` ends with `?pgbouncer=true` and uses port 6543.
- **Migration errors during build**: Ensure `DIRECT_URL` environment variable is set in Vercel.
