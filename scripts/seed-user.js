const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function seedUser() {
  try {
    const user = await db.user.upsert({
      where: { clerkUserId: 'user_35slGpHhq48zxa7v3KBLvnlVVvT' },
      update: { credits: 10, role: 'PATIENT' },
      create: {
        clerkUserId: 'user_35slGpHhq48zxa7v3KBLvnlVVvT',
        email: 'demo@pawcare.com',
        name: 'Demo User',
        role: 'PATIENT',
        credits: 10
      }
    });
    console.log('✅ Created/updated user:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

seedUser();
