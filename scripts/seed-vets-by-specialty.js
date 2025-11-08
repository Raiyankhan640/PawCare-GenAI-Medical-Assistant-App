/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// Extract "name: "Specialty"" entries from lib/specialities.js (contains JSX icons)
function readSpecialtyNames() {
  const file = path.join(process.cwd(), "lib", "specialities.js");
  const src = fs.readFileSync(file, "utf8");
  const names = new Set();
  const regex = /name:\s*["'`](.*?)["'`]\s*,/g;
  let m;
  while ((m = regex.exec(src)) !== null) {
    if (m[1] && !m[1].toLowerCase().includes("other")) names.add(m[1]);
  }
  // Always include "Other Specialties" at the end
  names.add("Other Specialties");
  return Array.from(names);
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const firstNames = ["Sarah", "James", "Emily", "Michael", "Lisa", "David", "Rachel", "Tom", "Nina", "Oliver", "Sophia", "Ethan"];
const lastNames = ["Mitchell", "Cooper", "Chen", "Rodriguez", "Thompson", "Park", "Green", "Wilson", "Patel", "Garcia", "Kim", "Nguyen"];

async function ensureAvailability(doctorId, startHour = 9, endHour = 17) {
  const exists = await db.availability.findFirst({ where: { doctorId } });
  if (exists) return;

  const startTime = new Date("1970-01-01T00:00:00.000Z");
  startTime.setUTCHours(startHour, 0, 0, 0);
  const endTime = new Date("1970-01-01T00:00:00.000Z");
  endTime.setUTCHours(endHour, 0, 0, 0);

  await db.availability.create({
    data: {
      doctorId,
      startTime,
      endTime,
      status: "AVAILABLE",
    },
  });
}

async function main() {
  const specialties = readSpecialtyNames();
  console.log(`🌱 Seeding veterinarians for ${specialties.length} specialties...`);

  for (const specialty of specialties) {
    const targetPerSpecialty = 3; // ensure at least 3 vets per specialty
    const existing = await db.user.findMany({
      where: { role: "DOCTOR", specialty },
      select: { id: true },
    });

    const toCreate = Math.max(0, targetPerSpecialty - existing.length);
    if (toCreate === 0) {
      console.log(`⏭️  ${specialty}: already has ${existing.length}`);
      // Still ensure availability
      for (const d of existing) await ensureAvailability(d.id);
      continue;
    }

    console.log(`➕ ${specialty}: creating ${toCreate} veterinarians...`);
    for (let i = 0; i < toCreate; i++) {
      const name = `${firstNames[(i + specialty.length) % firstNames.length]} ${lastNames[(i * 3 + specialty.length) % lastNames.length]}`;
      const email = `${slugify(name)}.${slugify(specialty)}@pawcare.vet`;
      const doctor = await db.user.create({
        data: {
          clerkUserId: `seed_${slugify(specialty)}_${crypto.randomUUID()}`,
          email,
          name: `Dr. ${name}`,
          role: "DOCTOR",
          specialty,
          experience: 5 + ((i + specialties.length) % 10),
          description: `Experienced ${specialty.toLowerCase()} veterinarian providing compassionate care.`,
          verificationStatus: "VERIFIED",
          credentialUrl: "https://example.com/credentials.pdf",
        },
      });

      // Give them availability (varied hours)
      const startHour = 8 + ((i * 2) % 4); // 8–11
      const endHour = startHour + 8;       // 8-hour window
      await ensureAvailability(doctor.id, startHour, endHour);
    }
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });