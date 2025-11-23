// Script to change your role from ADMIN to PATIENT for testing
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function changeRoleToPatient() {
    try {
        const email = 'raiyankhan640@gmail.com'; // Your email

        console.log(`🔄 Changing role for ${email} from ADMIN to PATIENT...`);

        const user = await prisma.user.update({
            where: { email },
            data: { role: 'PATIENT' },
        });

        console.log(`\n✅ Successfully updated!`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Old Role: ADMIN`);
        console.log(`   New Role: ${user.role}`);
        console.log(`\n✨ You can now test the patient onboarding flow!`);
        console.log(`   Go to: http://localhost:3000/doctors`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

changeRoleToPatient();
