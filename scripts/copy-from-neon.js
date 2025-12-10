// Script to copy doctors and users from Neon to local PostgreSQL
const { PrismaClient } = require('@prisma/client');

// Local database client
const localDb = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

// Neon database client  
const neonDb = new PrismaClient({
  datasources: {
    db: { url: process.env.NEON_DATABASE_URL }
  }
});

async function copyData() {
  try {
    console.log('🔄 Connecting to Neon database...');
    
    // Get all users from Neon (including doctors)
    const neonUsers = await neonDb.user.findMany({
      include: {
        availabilities: true
      }
    });
    
    console.log(`📥 Found ${neonUsers.length} users in Neon database`);
    
    // Copy each user to local database
    for (const user of neonUsers) {
      try {
        // Check if user already exists
        const existingUser = await localDb.user.findFirst({
          where: {
            OR: [
              { clerkUserId: user.clerkUserId },
              { email: user.email }
            ]
          }
        });
        
        if (existingUser) {
          // Update existing user
          await localDb.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name,
              imageUrl: user.imageUrl,
              role: user.role,
              credits: user.credits,
              specialty: user.specialty,
              experience: user.experience,
              credentialUrl: user.credentialUrl,
              description: user.description,
              verificationStatus: user.verificationStatus
            }
          });
          console.log(`✅ Updated user: ${user.name || user.email} (${user.role})`);
        } else {
          // Create new user
          const newUser = await localDb.user.create({
            data: {
              clerkUserId: user.clerkUserId,
              email: user.email,
              name: user.name,
              imageUrl: user.imageUrl,
              role: user.role,
              credits: user.credits,
              specialty: user.specialty,
              experience: user.experience,
              credentialUrl: user.credentialUrl,
              description: user.description,
              verificationStatus: user.verificationStatus
            }
          });
          
          // Copy availability if user is a doctor
          if (user.role === 'DOCTOR' && user.availabilities && user.availabilities.length > 0) {
            for (const avail of user.availabilities) {
              await localDb.availability.create({
                data: {
                  doctorId: newUser.id,
                  dayOfWeek: avail.dayOfWeek,
                  startTime: avail.startTime,
                  endTime: avail.endTime,
                  status: avail.status
                }
              });
            }
          }
          
          console.log(`✅ Created user: ${user.name || user.email} (${user.role})`);
        }
      } catch (userError) {
        console.log(`⚠️ Skipped user ${user.email}: ${userError.message}`);
      }
    }
    
    // Count doctors
    const doctorCount = await localDb.user.count({
      where: { role: 'DOCTOR', verificationStatus: 'VERIFIED' }
    });
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Total verified doctors in local DB: ${doctorCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await localDb.$disconnect();
    await neonDb.$disconnect();
  }
}

copyData();
