-- ==========================================
-- ASTRA Grievance Portal - Supabase SQL Setup
-- Run this script directly in Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create User Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "googleUserId" TEXT UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "department" TEXT DEFAULT 'Cyber Security',
  "year" TEXT,
  "passwordHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Category Table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Grievance Table
CREATE TABLE IF NOT EXISTS "Grievance" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "publicId" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
  "wantsResponse" BOOLEAN NOT NULL DEFAULT false,
  "confirmationTruthful" BOOLEAN NOT NULL DEFAULT true,
  "assignedToId" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Grievance
CREATE INDEX IF NOT EXISTS "Grievance_publicId_idx" ON "Grievance"("publicId");
CREATE INDEX IF NOT EXISTS "Grievance_userId_idx" ON "Grievance"("userId");
CREATE INDEX IF NOT EXISTS "Grievance_status_idx" ON "Grievance"("status");

-- 4. Create Attachment Table
CREATE TABLE IF NOT EXISTS "Attachment" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "grievanceId" TEXT NOT NULL REFERENCES "Grievance"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "storagePath" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create AdminNote Table
CREATE TABLE IF NOT EXISTS "AdminNote" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "grievanceId" TEXT NOT NULL REFERENCES "Grievance"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "adminId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Response Table
CREATE TABLE IF NOT EXISTS "Response" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "grievanceId" TEXT NOT NULL REFERENCES "Grievance"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "adminId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "message" TEXT NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create IdentityAccessLog Table
CREATE TABLE IF NOT EXISTS "IdentityAccessLog" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "grievanceId" TEXT NOT NULL REFERENCES "Grievance"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "adminId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "reason" TEXT NOT NULL,
  "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA (Categories & Default Accounts)
-- ==========================================

-- Insert Categories
INSERT INTO "Category" ("id", "name", "slug", "description") VALUES
(uuid_generate_v4()::text, 'Academic', 'academic', 'Curriculum, classes, course content, and academic scheduling'),
(uuid_generate_v4()::text, 'Faculty / Teaching', 'faculty-teaching', 'Teaching methodology, evaluation, and faculty interactions'),
(uuid_generate_v4()::text, 'Examination', 'examination', 'Exam scheduling, hall tickets, results, re-evaluation, and grading'),
(uuid_generate_v4()::text, 'Infrastructure', 'infrastructure', 'Classroom facilities, library, Wi-Fi, electricity, and campus amenities'),
(uuid_generate_v4()::text, 'Laboratory', 'laboratory', 'Lab equipment, software availability, lab safety, and lab instructor assistance'),
(uuid_generate_v4()::text, 'Hostel', 'hostel', 'Hostel accommodation, food quality, maintenance, and hostel regulations'),
(uuid_generate_v4()::text, 'Transportation', 'transportation', 'College bus timings, routes, driver behavior, and transit safety'),
(uuid_generate_v4()::text, 'Harassment / Misconduct', 'harassment-misconduct', 'Ragging, bullying, verbal abuse, unwanted behavior, or harassment'),
(uuid_generate_v4()::text, 'Discrimination', 'discrimination', 'Bias or unfair treatment based on gender, region, caste, or background'),
(uuid_generate_v4()::text, 'Cybersecurity / Digital Safety', 'cybersecurity-digital-safety', 'Data privacy breach, unauthorized access, digital security concerns, phishing'),
(uuid_generate_v4()::text, 'Department Activities', 'department-activities', 'ASTRA association events, workshops, technical fests, and symposiums'),
(uuid_generate_v4()::text, 'Student Association', 'student-association', 'Association elections, student representative concerns, and activities'),
(uuid_generate_v4()::text, 'Administrative', 'administrative', 'Fee payments, certificates, office requests, and documentation delays'),
(uuid_generate_v4()::text, 'Other', 'other', 'General concerns or matters not covered by specific categories')
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description";

-- Insert Default Accounts (Password for all: AstraSecure2026!)
INSERT INTO "User" ("id", "email", "name", "role", "department", "passwordHash", "year") VALUES
(uuid_generate_v4()::text, 'admin@astraietm.in', 'ASTRA Cyber Security Super Admin', 'SUPER_ADMIN', 'Cyber Security', '$2a$10$IkYM1t1wogX4v2UCMtRblOkVwci1IJMwpFeP8F1p5Jh5SP.9wyde2', NULL),
(uuid_generate_v4()::text, 'reviewer@astraietm.in', 'ASTRA Grievance Reviewer', 'REVIEWER', 'Cyber Security', '$2a$10$IkYM1t1wogX4v2UCMtRblOkVwci1IJMwpFeP8F1p5Jh5SP.9wyde2', NULL),
(uuid_generate_v4()::text, 'student@astraietm.in', 'Verified Student User', 'USER', 'Cyber Security', '$2a$10$IkYM1t1wogX4v2UCMtRblOkVwci1IJMwpFeP8F1p5Jh5SP.9wyde2', '3rd Year')
ON CONFLICT ("email") DO NOTHING;
