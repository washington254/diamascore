import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { mapCustomerRecord } from "@/lib/customer-utils";

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
