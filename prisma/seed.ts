import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Academic', slug: 'academic', description: 'Curriculum, classes, course content, and academic scheduling' },
  { name: 'Faculty / Teaching', slug: 'faculty-teaching', description: 'Teaching methodology, evaluation, and faculty interactions' },
  { name: 'Harassment / Misconduct', slug: 'harassment-misconduct', description: 'Ragging, bullying, verbal abuse, unwanted behavior, or harassment' },
  { name: 'Student Association', slug: 'student-association', description: 'Association elections, student representative concerns, and activities' },
];


async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Categories
  const allowedSlugs = defaultCategories.map((c) => c.slug);
  await prisma.category.updateMany({
    where: { slug: { notIn: allowedSlugs } },
    data: { active: false },
  });

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, active: true },
      create: { ...cat, active: true },
    });
  }
  console.log(`✅ Seeded ${defaultCategories.length} active categories.`);


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
