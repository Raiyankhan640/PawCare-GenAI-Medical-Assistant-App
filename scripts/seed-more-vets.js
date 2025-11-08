/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

/**
 * Read current specialty names from lib/specialities.js so we seed
 * exactly what your Find Vets page lists (no manual edits needed).
 */
function readSpecialtyNames() {
  const file = path.join(process.cwd(), "lib", "specialities.js");
  const src = fs.readFileSync(file, "utf8");
  const names = [];
  const regex = /name:\s*["'`](.*?)["'`]/g;
  let m;
  while ((m = regex.exec(src)) !== null) {
    if (m[1]) names.push(m[1]);
  }
  return names;
}

/**
 * Provide a veterinary‑focused description even if specialty label is still human oriented.
 */
function vetDescription(s) {
  const lower = s.toLowerCase();
  if (lower.includes("general")) return "Comprehensive preventive and internal care for companion animals.";
  if (lower.includes("cardio")) return "Focused on cardiac diagnostics and management for dogs and cats.";
  if (lower.includes("derma")) return "Skin, coat, allergy, and parasite management for all small animals.";
  if (lower.includes("endo")) return "Hormonal and metabolic disorders (diabetes, thyroid, adrenal) in pets.";
  if (lower.includes("gastro")) return "Digestive health, nutrition guidance, and chronic GI disorder care.";
  if (lower.includes("neuro")) return "Neurological assessments: seizures, spinal issues, gait disorders.";
  if (lower.includes("obstetrics") || lower.includes("gyne")) return "Reproductive health, neonatal care, breeding guidance for small animals.";
  if (lower.includes("onco")) return "Cancer diagnostics, staging, and multimodal therapy for pets.";
  if (lower.includes("ophthal")) return "Eye disease diagnostics, vision preservation, and ocular surgery prep.";
  if (lower.includes("ortho")) return "Bone, joint, and ligament injury management; post‑operative recovery plans.";
  if (lower.includes("pedia")) return "Puppy/kitten wellness, early development, vaccination planning.";
  if (lower.includes("psych")) return "Behavioral consultations, anxiety, and enrichment strategies.";
  if (lower.includes("pulmo")) return "Respiratory disease evaluation (airway, lung, infectious conditions).";
  if (lower.includes("radio")) return "Diagnostic imaging (XR, US) interpretation for accurate treatment planning.";
  if (lower.includes("uro")) return "Urinary tract, renal health, and electrolyte disorder management.";
  return "Specialized veterinary care tailored to companion animal needs.";
}

/**
 * Generate a deterministic but varied name set.
 */
const firstNames = [
  "Ava","Liam","Maya","Noah","Zoe","Elijah","Iris","Leo","Chloe","Owen",
  "Nora","Eli","Ruby","Finn","Luna","Miles","Daisy","Caleb","Hazel","Jasper"
];
const lastNames = [
  "Brooks","Rivera","Hayes","Sutton","Mendoza","Reeves","Lam","Khan","Dalton","Pratt",
  "Mercer","Tyler","Frost","Hendricks","Carter","Whitman","Lowell","Garner","Quinn","Shepard"
];

function randomName(i, specialty) {
  const hash = crypto.createHash("md5").update(specialty + i).digest("hex");
  const f = parseInt(hash.slice(0, 2), 16) % firstNames.length;
  const l = parseInt(hash.slice(2, 4), 16) % lastNames.length;
  return `Dr. ${firstNames[f]} ${lastNames[l]}`;
}

function randomEmail(name, specialty) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}.${specialty.toLowerCase().replace(/[^a-z]+/g, ".")}@pawcare.vet`;
}

/**
 * Create availability (single range). Your slot logic reads one record
 * and derives 30‑min windows.
 */
async function createAvailability(doctorId) {
  // Random start between 8–10, 8 hour length
  const startHour = 8 + Math.floor(Math.random() * 3);
  const endHour = startHour + 8;
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
  const targetPerSpecialty = 5; // ensure at least 5 vets each
  console.log(`🌱 Seeding veterinarians for ${specialties.length} specialties (min ${targetPerSpecialty} each)...`);

  for (const specialty of specialties) {
    const existing = await db.user.findMany({
      where: { role: "DOCTOR", specialty },
      select: { id: true },
    });

    const deficit = targetPerSpecialty - existing.length;
    if (deficit <= 0) {
      console.log(`⏭️  ${specialty}: already has ${existing.length}, ensuring availability...`);
      for (const d of existing) {
        const avail = await db.availability.findFirst({ where: { doctorId: d.id } });
        if (!avail) await createAvailability(d.id);
      }
      continue;
    }

    console.log(`➕ ${specialty}: creating ${deficit} veterinarians...`);
    for (let i = 0; i < deficit; i++) {
      const name = randomName(i, specialty);
      const email = randomEmail(name, specialty);
      const doctor = await db.user.create({
        data: {
          clerkUserId: `seed_${crypto.randomUUID()}`,
            // If your schema has an explicit id default in Prisma, omit id
          email,
          name,
          role: "DOCTOR",
          specialty,
          experience: 3 + Math.floor(Math.random() * 12),
          description: vetDescription(specialty),
          verificationStatus: "VERIFIED",
          credentialUrl: "https://example.com/credential.pdf",
          // Add other fields your schema expects if any (e.g. avatarUrl)
        },
      });

      await createAvailability(doctor.id);
    }
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());