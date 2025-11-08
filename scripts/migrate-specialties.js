/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// Map old human-focused specialties to new veterinary ones
const MAP = new Map([
  ["General Medicine", "General Veterinary Medicine"],
  ["Cardiology", "Veterinary Cardiology"],
  ["Dermatology", "Veterinary Dermatology"],
  ["Endocrinology", "Internal Medicine"],
  ["Gastroenterology", "Internal Medicine"],
  ["Neurology", "Veterinary Neurology"],
  ["Obstetrics & Gynecology", "Small Animal Medicine"],
  ["Oncology", "Internal Medicine"],
  ["Ophthalmology", "Veterinary Ophthalmology"],
  ["Orthopedics", "Veterinary Orthopedics"],
  ["Pediatrics", "Small Animal Medicine"],
  ["Psychiatry", "Small Animal Medicine"],
  ["Pulmonology", "Internal Medicine"],
  ["Radiology", "Laboratory Medicine"],
  ["Urology", "Internal Medicine"],
  ["Other", "Other Specialties"],
]);

async function main() {
  const docs = await db.user.findMany({
    where: { role: "DOCTOR" },
    select: { id: true, specialty: true },
  });

  let updated = 0;
  for (const d of docs) {
    const next = MAP.get(d.specialty);
    if (next && next !== d.specialty) {
      await db.user.update({ where: { id: d.id }, data: { specialty: next } });
      updated++;
    }
  }
  console.log(`✅ Updated ${updated} doctors to veterinary specialties.`);
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());