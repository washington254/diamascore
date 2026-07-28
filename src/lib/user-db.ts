import prisma from "./prisma";
import crypto from "crypto";

export interface DBUser {
  id: string;
  name: string | null;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple and secure SHA-512 based password hashing using Node built-in crypto
export function hashPassword(password: string): string {
  const salt = "diamas_core_secure_salt_98765";
  return crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  const newHash = hashPassword(password);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(newHash, "hex"),
      Buffer.from(hash, "hex")
    );
  } catch (e) {
    return false;
  }
}

// Function to initialize the User table in PostgreSQL raw SQL
export async function initUserTable() {
  try {
    // Check if the table exists first to prevent unnecessary errors
    const tableCheck = await prisma.$queryRawUnsafe<any[]>(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'User'
      );
    `);

    const tableExists = tableCheck[0]?.exists;

    if (!tableExists) {
      console.log("User table does not exist. Creating now...");
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "name" TEXT,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
      `);
      
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
      `);
      console.log("User table and email index successfully created in PostgreSQL.");
    }
  } catch (error) {
    console.error("Error during User table check/creation:", error);
  }
}

export async function findUserByEmail(email: string): Promise<any | null> {
  await initUserTable();
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const rows = await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "User" WHERE LOWER(email) = $1 LIMIT 1',
      normalizedEmail
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Failed to query user by email:", error);
    return null;
  }
}

export async function createUser(
  email: string,
  passwordPlain: string,
  name?: string
): Promise<any | null> {
  await initUserTable();
  try {
    const id = "usr-" + crypto.randomBytes(16).toString("hex");
    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = hashPassword(passwordPlain);
    
    await prisma.$executeRawUnsafe(
      'INSERT INTO "User" ("id", "name", "email", "password", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      id,
      name || null,
      normalizedEmail,
      passwordHash
    );

    return {
      id,
      name: name || null,
      email: normalizedEmail,
    };
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
}
