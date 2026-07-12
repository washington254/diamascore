import "dotenv/config";
import prisma from "../lib/prisma";
import { randomUUID } from "crypto";

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n");

  try {
    console.log("📝 Creating a test customer...");

    const timestamp = Date.now();

    const customer = await prisma.customer.create({
      data: {
        id: randomUUID(),
        name: "Test Customer",
        email: `customer-${timestamp}@example.com`,
        platform: "WordPress",
        registeredAt: new Date(),
      },
    });

    console.log("✅ Customer created!");
    console.log(customer);

    console.log("\n📋 Fetching customers...");

    const customers = await prisma.customer.findMany();

    console.log(`✅ Found ${customers.length} customer(s).\n`);

    customers.forEach((customer) => {
      console.log(
        `• ${customer.name} | ${customer.email} | ${customer.platform}`
      );
    });

    console.log("\n🧹 Cleaning up test customer...");

    await prisma.customer.delete({
      where: {
        id: customer.id,
      },
    });

    console.log("✅ Test customer deleted.");
    console.log("\n🎉 Database test passed!");
  } catch (error) {
    console.error("\n❌ Database test failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

void testDatabase();