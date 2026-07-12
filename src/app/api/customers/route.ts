import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { customerPayloadSchema } from "@/lib/customer-schema";
import { mapCustomerRecords } from "@/lib/customer-utils";

const defaultAvatar = "/images/user/user-17.jpg";

async function ensureCustomerTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "avatar" TEXT,
      "platform" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "registeredAt" TIMESTAMP(3) NOT NULL,
      "popupOpens" INTEGER NOT NULL DEFAULT 0,
      "popupCloses" INTEGER NOT NULL DEFAULT 0,
      "popupSuccess" INTEGER NOT NULL DEFAULT 0,
      "popupRejection" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function GET() {
  try {
    await ensureCustomerTable();

    const customers = await prisma.customer.findMany({
      orderBy: {
        registeredAt: "desc",
      },
    });

    return NextResponse.json(mapCustomerRecords(customers));
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureCustomerTable();

    const json = await request.json();
    const parsed = customerPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid customer payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const registeredAt = new Date(payload.registeredDate);

    const customer = await prisma.customer.upsert({
      where: {
        id: payload.id,
      },
      create: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar || defaultAvatar,
        platform: payload.platform,
        status: payload.status || "Active",
        registeredAt,
        popupOpens: payload.popupStats?.opens ?? 0,
        popupCloses: payload.popupStats?.closes ?? 0,
        popupSuccess: payload.popupStats?.success ?? 0,
        popupRejection: payload.popupStats?.rejection ?? 0,
      },
      update: {
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar || defaultAvatar,
        platform: payload.platform,
        status: payload.status || "Active",
        registeredAt,
        popupOpens: payload.popupStats?.opens ?? 0,
        popupCloses: payload.popupStats?.closes ?? 0,
        popupSuccess: payload.popupStats?.success ?? 0,
        popupRejection: payload.popupStats?.rejection ?? 0,
      },
    });

    return NextResponse.json(mapCustomerRecords([customer])[0], {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}
