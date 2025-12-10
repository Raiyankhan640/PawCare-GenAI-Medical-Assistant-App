import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const db = new PrismaClient();

const bangladeshiDoctors = [
    {
        name: "Dr. Nazia Rahman",
        email: "nazia.rahman@pawcare.bd",
        specialty: "Small Animal Medicine",
        experience: 7,
        description: "Specialist in preventive care for dogs and cats in Dhaka region.",
        hours: { start: 9, end: 17 },
    },
    {
        name: "Dr. Tanvir Hossain",
        email: "tanvir.hossain@pawcare.bd",
        specialty: "Veterinary Surgery",
        experience: 10,
        description: "Expert surgeon specializing in orthopedic procedures, serving Chittagong area.",
        hours: { start: 10, end: 18 },
    },
    {
        name: "Dr. Ayesha Siddique",
        email: "ayesha.siddique@pawcare.bd",
        specialty: "Veterinary Cardiology",
        experience: 9,
        description: "Cardiac specialist focusing on heart conditions in pets, based in Dhaka.",
        hours: { start: 8, end: 16 },
    },
    {
        name: "Dr. Mahmud Hassan",
        email: "mahmud.hassan@pawcare.bd",
        specialty: "Exotic Pet Medicine",
        experience: 6,
        description: "Specialist in birds, reptiles, and exotic animals in Sylhet.",
        hours: { start: 11, end: 19 },
    },
    {
        name: "Dr. Farhana Begum",
        email: "farhana.begum@pawcare.bd",
        specialty: "Veterinary Dermatology",
        experience: 8,
        description: "Expert in treating skin conditions and allergies in pets, Dhaka.",
        hours: { start: 9, end: 17 },
    },
    {
        name: "Dr. Imran Chowdhury",
        email: "imran.chowdhury@pawcare.bd",
        specialty: "Emergency & Critical Care",
        experience: 12,
        description: "24/7 emergency veterinary specialist with ICU experience, Chittagong.",
        hours: { start: 8, end: 20 },
    },
    {
        name: "Dr. Sabrina Akter",
        email: "sabrina.akter@pawcare.bd",
        specialty: "Veterinary Dentistry",
        experience: 5,
        description: "Dental health specialist for pets, practicing in Dhaka.",
        hours: { start: 10, end: 16 },
    },
];

async function updateDoctors() {
    try {
        console.log("🔄 Starting doctor database update...");

        // Get Dr. Raiyan Khan's ID if exists
        const drRaiyan = await db.user.findFirst({
            where: {
                name: { contains: "Raiyan Khan", mode: "insensitive" },
                role: "DOCTOR"
            }
        });

        if (drRaiyan) {
            console.log(`✅ Found Dr. Raiyan Khan (${drRaiyan.email}) - will be preserved`);
        }

        // Get all doctors to delete (except Dr. Raiyan Khan)
        const doctorsToDelete = await db.user.findMany({
            where: {
                role: "DOCTOR",
                id: drRaiyan ? { not: drRaiyan.id } : undefined,
            },
            select: { id: true, name: true }
        });

        console.log(`📋 Found ${doctorsToDelete.length} doctors to remove`);

        // Delete related data for each doctor (to handle foreign key constraints)
        for (const doctor of doctorsToDelete) {
            // Delete appointments for this doctor
            const deletedAppointments = await db.appointment.deleteMany({
                where: { doctorId: doctor.id }
            });

            // Delete availabilities for this doctor
            const deletedAvailabilities = await db.availability.deleteMany({
                where: { doctorId: doctor.id }
            });

            console.log(`  🗑️  ${doctor.name}: Removed ${deletedAppointments.count} appointments, ${deletedAvailabilities.count} availabilities`);
        }

        // Now delete the doctors
        const deleteResult = await db.user.deleteMany({
            where: {
                role: "DOCTOR",
                id: drRaiyan ? { not: drRaiyan.id } : undefined,
            },
        });

        console.log(`🗑️  Removed ${deleteResult.count} non-Bangladeshi doctors`);

        // Add new Bangladeshi doctors
        let addedCount = 0;
        for (const doctorInfo of bangladeshiDoctors) {
            // Check if doctor already exists
            const existingDoctor = await db.user.findUnique({
                where: { email: doctorInfo.email },
            });

            if (existingDoctor) {
                console.log(`⏭️  Skipping ${doctorInfo.name} - already exists`);
                continue;
            }

            // Create doctor
            const doctor = await db.user.create({
                data: {
                    id: crypto.randomUUID(),
                    clerkUserId: `clerk_${crypto.randomUUID()}`,
                    email: doctorInfo.email,
                    name: doctorInfo.name,
                    role: "DOCTOR",
                    specialty: doctorInfo.specialty,
                    experience: doctorInfo.experience,
                    description: doctorInfo.description,
                    verificationStatus: "VERIFIED",
                    credentialUrl: "https://example.com/credentials.pdf",
                },
            });

            // Create availability
            const startTime = new Date("1970-01-01");
            startTime.setHours(doctorInfo.hours.start, 0, 0, 0);

            const endTime = new Date("1970-01-01");
            endTime.setHours(doctorInfo.hours.end, 0, 0, 0);

            await db.availability.create({
                data: {
                    doctorId: doctor.id,
                    startTime: startTime,
                    endTime: endTime,
                    status: "AVAILABLE",
                },
            });

            console.log(`✅ Added ${doctor.name} (${doctor.specialty})`);
            addedCount++;
        }

        console.log("\n🎉 Doctor update completed successfully!");
        console.log(`📊 Summary:`);
        console.log(`   - Preserved: ${drRaiyan ? '1 (Dr. Raiyan Khan)' : '0'}`);
        console.log(`   - Removed: ${deleteResult.count}`);
        console.log(`   - Added: ${addedCount}`);
        console.log(`   - Total doctors now: ${addedCount + (drRaiyan ? 1 : 0)}`);
    } catch (error) {
        console.error("❌ Error updating doctors:", error);
        throw error;
    } finally {
        await db.$disconnect();
    }
}

// Run the update
updateDoctors()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
