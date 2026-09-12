import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Academic', slug: 'academic', description: 'Curriculum, classes, course content, and academic scheduling' },
  { name: 'Faculty / Teaching', slug: 'faculty-teaching', description: 'Teaching methodology, evaluation, and faculty interactions' },
  { name: 'Examination', slug: 'examination', description: 'Exam scheduling, hall tickets, results, re-evaluation, and grading' },
  { name: 'Infrastructure', slug: 'infrastructure', description: 'Classroom facilities, library, Wi-Fi, electricity, and campus amenities' },
  { name: 'Laboratory', slug: 'laboratory', description: 'Lab equipment, software availability, lab safety, and lab instructor assistance' },
  { name: 'Hostel', slug: 'hostel', description: 'Hostel accommodation, food quality, maintenance, and hostel regulations' },
  { name: 'Transportation', slug: 'transportation', description: 'College bus timings, routes, driver behavior, and transit safety' },
  { name: 'Harassment / Misconduct', slug: 'harassment-misconduct', description: 'Ragging, bullying, verbal abuse, unwanted behavior, or harassment' },
  { name: 'Discrimination', slug: 'discrimination', description: 'Bias or unfair treatment based on gender, region, caste, or background' },
  { name: 'Cybersecurity / Digital Safety', slug: 'cybersecurity-digital-safety', description: 'Data privacy breach, unauthorized access, digital security concerns, phishing' },
  { name: 'Department Activities', slug: 'department-activities', description: 'ASTRA association events, workshops, technical fests, and symposiums' },
  { name: 'Student Association', slug: 'student-association', description: 'Association elections, student representative concerns, and activities' },
  { name: 'Administrative', slug: 'administrative', description: 'Fee payments, certificates, office requests, and documentation delays' },
  { name: 'Other', slug: 'other', description: 'General concerns or matters not covered by specific categories' },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Categories
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`✅ Seeded ${defaultCategories.length} categories.`);

  // 2. Seed Default Accounts for Development / Initial Deployment
  const defaultPasswordHash = await bcrypt.hash('AstraSecure2026!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@astraietm.in' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: 'admin@astraietm.in',
      name: 'ASTRA Cyber Security Super Admin',
      role: 'SUPER_ADMIN',
      department: 'Cyber Security',
      passwordHash: defaultPasswordHash,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@astraietm.in' },
    update: { role: 'REVIEWER' },
    create: {
      email: 'reviewer@astraietm.in',
      name: 'ASTRA Grievance Reviewer',
      role: 'REVIEWER',
      department: 'Cyber Security',
      passwordHash: defaultPasswordHash,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@astraietm.in' },
    update: {},
    create: {
      email: 'student@astraietm.in',
      name: 'Verified Student User',
      role: 'USER',
      department: 'Cyber Security',
      year: '3rd Year',
      passwordHash: defaultPasswordHash,
    },
  });

  console.log('✅ Seeded default accounts:');
  console.log(`   - SUPER_ADMIN: ${superAdmin.email} (Password: AstraSecure2026!)`);
  console.log(`   - REVIEWER: ${reviewer.email} (Password: AstraSecure2026!)`);
  console.log(`   - USER: ${student.email} (Password: AstraSecure2026!)`);
  console.log('🌱 Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
