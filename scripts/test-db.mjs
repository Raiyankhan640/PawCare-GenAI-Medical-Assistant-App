// Quick database test script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...');

        // Test connection
        await prisma.$connect();
        console.log('✅ Database connected successfully!');

        // Count all users
        const userCount = await prisma.user.count();
        console.log(`📊 Total users in database: ${userCount}`);

        // List all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                clerkUserId: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        console.log('\n👥 All users:');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.name || 'No name'}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Clerk ID: ${user.clerkUserId}`);
            console.log(`   Created: ${user.createdAt}`);
        });

        if (users.length === 0) {
            console.log('\n⚠️  No users found in database!');
            console.log('This means the webhook is not creating users.');
        }

    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();
