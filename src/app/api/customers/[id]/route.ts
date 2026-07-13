import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { mapCustomerRecord } from "@/lib/customer-utils";
import { popupStatsUpdateSchema } from "@/lib/customer-schema";

interface CustomerRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: CustomerRouteContext,
) {
  try {
    const { id } = await context.params;

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(mapCustomerRecord(customer));
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: CustomerRouteContext,
) {
  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = popupStatsUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid popup stats payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    const { popupStats } = parsed.data;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        popupOpens: popupStats.opens,
        popupCloses: popupStats.closes,
        popupSuccess: popupStats.success,
        popupRejection: popupStats.rejection,
      },
    });

    return NextResponse.json(mapCustomerRecord(customer));
  } catch (error) {
    console.error("Failed to update customer popup stats:", error);
    return NextResponse.json(
      { error: "Failed to update customer popup stats" },
      { status: 500 },
    );
  }
}
