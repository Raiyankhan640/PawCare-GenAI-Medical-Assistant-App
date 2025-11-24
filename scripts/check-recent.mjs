// Check for the most recent user (likely you)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRecentUsers() {
    try {
        console.log('🔍 Checking for recent users...\n');

        // Get the most recent 5 users
        const recentUsers = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                clerkUserId: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        console.log('📋 5 Most Recent Users:\n');
        recentUsers.forEach((user, index) => {
            const isNew = new Date() - new Date(user.createdAt) < 3600000; // Less than 1 hour old
            console.log(`${index + 1}. ${user.name || 'No name'} ${isNew ? '🆕' : ''}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Clerk ID: ${user.clerkUserId}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log(`   Updated: ${user.updatedAt}\n`);
        });

        // Check for UNASSIGNED users (users who haven't completed onboarding)
        const unassignedUsers = await prisma.user.findMany({
            where: { role: 'UNASSIGNED' },
            select: {
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (unassignedUsers.length > 0) {
            console.log(`\n⚠️  Found ${unassignedUsers.length} user(s) who haven't completed onboarding:`);
            unassignedUsers.forEach((user) => {
                console.log(`   - ${user.email} (${user.name || 'No name'})`);
            });
        } else {
            console.log('\n✅ All users have completed onboarding (no UNASSIGNED users)');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkRecentUsers();
