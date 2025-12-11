const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clerkUserId: true,
      },
    });

    console.log('\n=== Users in Database ===\n');
    if (users.length === 0) {
      console.log('No users found in database!');
    } else {
      users.forEach((u) => {
        console.log(`Name: ${u.name || 'N/A'}`);
        console.log(`Email: ${u.email}`);
        console.log(`Role: ${u.role || 'UNASSIGNED'}`);
        console.log(`Clerk ID: ${u.clerkUserId}`);
        console.log('---');
      });
    }
    console.log(`\nTotal users: ${users.length}\n`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
