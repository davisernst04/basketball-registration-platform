import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  // Create sample tryout sessions
  const tryout1 = await prisma.tryout.create({
    data: {
      location: "Shadow Basketball Center, 123 Main Street",
      date: new Date("2026-02-15"),
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      ageGroup: "Ages 8-10 (Elementary)",
      maxCapacity: 20,
      notes: "Please arrive 15 minutes early. Bring water and appropriate footwear.",
    },
  });

  const tryout2 = await prisma.tryout.create({
    data: {
      location: "Shadow Basketball Center, 123 Main Street",
      date: new Date("2026-02-15"),
      startTime: "12:00 PM",
      endTime: "02:00 PM",
      ageGroup: "Ages 11-13 (Middle School)",
      maxCapacity: 25,
      notes: "Please arrive 15 minutes early. Bring water and appropriate footwear.",
    },
  });

  const tryout3 = await prisma.tryout.create({
    data: {
      location: "Shadow Basketball Center, 123 Main Street",
      date: new Date("2026-02-22"),
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      ageGroup: "Ages 14-18 (High School)",
      maxCapacity: 30,
      notes: "Please bring your own basketball. Arrive 15 minutes early for check-in.",
    },
  });

  const tryout4 = await prisma.tryout.create({
    data: {
      location: "Riverside Community Gym, 456 Oak Avenue",
      date: new Date("2026-03-01"),
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      ageGroup: "Ages 6-7 (Beginner)",
      maxCapacity: 15,
      notes: "Introduction to basketball fundamentals. No prior experience needed.",
    },
  });

  console.log("✅ Created tryout sessions:", {
    tryout1: tryout1.id,
    tryout2: tryout2.id,
    tryout3: tryout3.id,
    tryout4: tryout4.id,
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
