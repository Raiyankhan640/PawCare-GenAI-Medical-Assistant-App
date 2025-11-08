import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const db = new PrismaClient();

const doctorData = [
  {
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@pawcare.vet",
    specialty: "Small Animal Medicine",
    experience: 8,
    description: "Specialized in preventive care and internal medicine for small pets.",
    hours: { start: 9, end: 17 },
  },
  {
    name: "Dr. James Cooper",
    email: "james.cooper@pawcare.vet",
    specialty: "Veterinary Surgery",
    experience: 12,
    description: "Expert in soft tissue and orthopedic surgeries.",
    hours: { start: 10, end: 18 },
  },
  {
    name: "Dr. Emily Chen",
    email: "emily.chen@pawcare.vet",
    specialty: "Veterinary Cardiology",
    experience: 10,
    description: "Cardiac specialist with focus on heart disease in dogs and cats.",
    hours: { start: 8, end: 16 },
  },
  {
    name: "Dr. Michael Rodriguez",
    email: "michael.rodriguez@pawcare.vet",
    specialty: "Exotic Pet Medicine",
    experience: 6,
    description: "Specializing in birds, reptiles, and small exotic animals.",
    hours: { start: 11, end: 19 },
  },
  {
    name: "Dr. Lisa Thompson",
    email: "lisa.thompson@pawcare.vet",
    specialty: "Veterinary Dermatology",
    experience: 9,
    description: "Expert in skin conditions, allergies, and dermatological issues.",
    hours: { start: 9, end: 17 },
  },
  {
    name: "Dr. David Park",
    email: "david.park@pawcare.vet",
    specialty: "Emergency & Critical Care",
    experience: 11,
    description: "24/7 emergency care specialist with ICU experience.",
    hours: { start: 8, end: 20 },
  },
  {
    name: "Dr. Rachel Green",
    email: "rachel.green@pawcare.vet",
    specialty: "Veterinary Dentistry",
    experience: 7,
    description: "Dental specialist focusing on oral health and surgery.",
    hours: { start: 10, end: 16 },
  },
  {
    name: "Dr. Tom Wilson",
    email: "tom.wilson@pawcare.vet",
    specialty: "Veterinary Neurology",
    experience: 13,
    description: "Neurological specialist treating seizures, spinal issues, and brain disorders.",
    hours: { start: 9, end: 17 },
  },
];

async function seedDoctors() {
  try {
    console.log("🌱 Starting doctors and availability seeding...");

    for (const doctorInfo of doctorData) {
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
          credentialUrl: "https://example.com/credentials.pdf", // Placeholder
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

      console.log(
        `✅ Created ${doctor.name} (${doctor.specialty}) with availability ${doctorInfo.hours.start}:00 - ${doctorInfo.hours.end}:00`
      );
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Total doctors seeded: ${doctorData.length}`);
  } catch (error) {
    console.error("❌ Error seeding doctors:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run the seeding function
seedDoctors()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });