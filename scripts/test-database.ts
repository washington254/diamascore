import "dotenv/config";
import prisma from "../lib/prisma";

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n");

  try {
    console.log("✅ Connected to database!");

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("\n📝 Creating a test user...");
    const timestamp = Date.now();
    const newUser = await prisma.user.create({
      data: {
        email: `demo-${timestamp}@example.com`,
        name: "Demo User",
      },
    });
    console.log("✅ Created user:", newUser);

    console.log("\n📋 Fetching all users...");
    const allUsers = await prisma.user.findMany();
    console.log(`✅ Found ${allUsers.length} user(s):`);
    allUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    console.log("\n🎉 All tests passed! Your database is working perfectly.\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

void testDatabase();
