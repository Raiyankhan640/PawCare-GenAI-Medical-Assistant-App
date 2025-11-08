import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seedAvailability() {
  try {
    console.log("🌱 Starting availability seeding...");

    // Fetch all verified doctors
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (doctors.length === 0) {
      console.log("⚠️  No verified doctors found. Please create doctors first.");
      return;
    }

    console.log(`📋 Found ${doctors.length} verified doctors`);

    // Generate availability for each doctor
    for (const doctor of doctors) {
      // Check if doctor already has availability
      const existingAvailability = await db.availability.findFirst({
        where: { doctorId: doctor.id },
      });

      if (existingAvailability) {
        console.log(`⏭️  Skipping ${doctor.name} - already has availability`);
        continue;
      }

      // Random availability patterns for variety
      const availabilityPatterns = [
        { start: 9, end: 17 },   // 9 AM - 5 PM
        { start: 10, end: 18 },  // 10 AM - 6 PM
        { start: 8, end: 16 },   // 8 AM - 4 PM
        { start: 11, end: 19 },  // 11 AM - 7 PM
        { start: 9, end: 15 },   // 9 AM - 3 PM (part-time)
      ];

      // Pick a random pattern
      const pattern = availabilityPatterns[
        Math.floor(Math.random() * availabilityPatterns.length)
      ];

      // Create availability (using a reference date, only time matters)
      const startTime = new Date("1970-01-01");
      startTime.setHours(pattern.start, 0, 0, 0);

      const endTime = new Date("1970-01-01");
      endTime.setHours(pattern.end, 0, 0, 0);

      await db.availability.create({
        data: {
          doctorId: doctor.id,
          startTime: startTime,
          endTime: endTime,
          status: "AVAILABLE",
        },
      });

      console.log(
        `✅ Created availability for ${doctor.name}: ${pattern.start}:00 - ${pattern.end}:00`
      );
    }

    console.log("\n🎉 Availability seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding availability:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run the seeding function
seedAvailability()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });