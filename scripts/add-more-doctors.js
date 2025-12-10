import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const db = new PrismaClient();

const newBangladeshiDoctors = [
    {
        name: "Dr. Sharmin Sultana",
        email: "sharmin.sultana@pawcare.bd",
        specialty: "Veterinary Ophthalmology",
        experience: 9,
        description: "Eye specialist treating cataracts, glaucoma, and other ocular conditions in pets, Dhaka.",
        hours: { start: 9, end: 17 },
    },
    {
        name: "Dr. Kamal Ahmed",
        email: "kamal.ahmed@pawcare.bd",
        specialty: "Veterinary Neurology",
        experience: 11,
        description: "Neurological specialist focusing on seizures, spinal disorders, and brain conditions, Chittagong.",
        hours: { start: 10, end: 18 },
    },
    {
        name: "Dr. Nasrin Jahan",
        email: "nasrin.jahan@pawcare.bd",
        specialty: "Veterinary Oncology",
        experience: 8,
        description: "Cancer specialist providing chemotherapy and treatment plans for pets with tumors, Dhaka.",
        hours: { start: 8, end: 16 },
    },
    {
        name: "Dr. Fahim Rahman",
        email: "fahim.rahman@pawcare.bd",
        specialty: "Internal Medicine",
        experience: 10,
        description: "Expert in diagnosing and treating complex medical conditions in pets, Sylhet.",
        hours: { start: 9, end: 17 },
    },
    {
        name: "Dr. Labiba Haque",
        email: "labiba.haque@pawcare.bd",
        specialty: "Behavioral Medicine",
        experience: 6,
        description: "Animal behavior specialist helping with anxiety, aggression, and training issues, Dhaka.",
        hours: { start: 11, end: 19 },
    },
    {
        name: "Dr. Shakil Mahmud",
        email: "shakil.mahmud@pawcare.bd",
        specialty: "Orthopedic Surgery",
        experience: 12,
        description: "Orthopedic surgeon specializing in fractures, joint replacements, and mobility issues, Chittagong.",
        hours: { start: 8, end: 16 },
    },
    {
        name: "Dr. Tasneem Akter",
        email: "tasneem.akter@pawcare.bd",
        specialty: "General Practice",
        experience: 5,
        description: "General veterinarian providing routine care, vaccinations, and wellness exams in Dhaka.",
        hours: { start: 9, end: 18 },
    },
    {
        name: "Dr. Rafiq Islam",
        email: "rafiq.islam@pawcare.bd",
        specialty: "General Practice",
        experience: 7,
        description: "Family vet specializing in preventive care and wellness for all pet types, Sylhet.",
        hours: { start: 10, end: 17 },
    },
    {
        name: "Dr. Meher Afroz",
        email: "meher.afroz@pawcare.bd",
        specialty: "Internal Medicine",
        experience: 9,
        description: "Specialist in kidney disease, diabetes, and endocrine disorders in pets, Dhaka.",
        hours: { start: 8, end: 16 },
    },
    {
        name: "Dr. Javed Khan",
        email: "javed.khan@pawcare.bd",
        specialty: "Emergency Medicine",
        experience: 10,
        description: "Emergency veterinarian with expertise in trauma, poisoning, and critical care, Chittagong.",
        hours: { start: 8, end: 20 },
    },
    {
        name: "Dr. Sanjida Rahman",
        email: "sanjida.rahman@pawcare.bd",
        specialty: "General Practice",
        experience: 4,
        description: "Compassionate general vet focusing on wellness and preventive medicine, Dhaka.",
        hours: { start: 9, end: 17 },
    },
    {
        name: "Dr. Mizan Chowdhury",
        email: "mizan.chowdhury@pawcare.bd",
        specialty: "Veterinary Surgery",
        experience: 13,
        description: "Experienced surgeon specializing in soft tissue and abdominal surgeries, Sylhet.",
        hours: { start: 9, end: 18 },
    },
];

async function addMoreDoctors() {
    try {
        console.log("🔄 Adding more Bangladeshi doctors to database...");

        let addedCount = 0;
        let skippedCount = 0;

        for (const doctorInfo of newBangladeshiDoctors) {
            // Check if doctor already exists
            const existingDoctor = await db.user.findUnique({
                where: { email: doctorInfo.email },
            });

            if (existingDoctor) {
                console.log(`⏭️  Skipping ${doctorInfo.name} - already exists`);
                skippedCount++;
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

        // Count total doctors
        const totalDoctors = await db.user.count({
            where: { role: "DOCTOR" }
        });

        console.log("\n🎉 Doctor addition completed successfully!");
        console.log(`📊 Summary:`);
        console.log(`   - Added: ${addedCount}`);
        console.log(`   - Skipped (already exist): ${skippedCount}`);
        console.log(`   - Total doctors in database: ${totalDoctors}`);
    } catch (error) {
        console.error("❌ Error adding doctors:", error);
        throw error;
    } finally {
        await db.$disconnect();
    }
}

// Run the script
addMoreDoctors()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
