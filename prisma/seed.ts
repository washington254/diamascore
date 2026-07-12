import { PrismaClient } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  await prisma.customer.createMany({
    data: [
      {
        id: "cust_001",
        name: "John Distillery",
        email: "john@distillery.com",
        avatar: null,
        platform: "Shopify",
        status: "Active",
        registeredAt: new Date("2026-01-15"),
        popupOpens: 120,
        popupCloses: 80,
        popupSuccess: 35,
        popupRejection: 10,
      },
      {
        id: "cust_002",
        name: "Mountain Spirits Co.",
        email: "contact@mountainspirits.com",
        avatar: null,
        platform: "WordPress",
        status: "Active",
        registeredAt: new Date("2026-02-10"),
        popupOpens: 250,
        popupCloses: 170,
        popupSuccess: 75,
        popupRejection: 20,
      },
      {
        id: "cust_003",
        name: "Oak Barrel Reserve",
        email: "hello@oakbarrel.com",
        avatar: null,
        platform: "Shopify",
        status: "Inactive",
        registeredAt: new Date("2026-03-05"),
        popupOpens: 60,
        popupCloses: 50,
        popupSuccess: 12,
        popupRejection: 8,
      },
    ],
  });

  console.log("✅ Customers seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });