import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/videos/[customerId]
 *
 * Returns the Cloudinary video URLs stored for a given customer.
 * Called by the popup frontend JavaScript to retrieve the correct video.
 *
 * Response:
 * {
 *   desktop: string | null,   // Cloudinary URL for landscape/desktop video
 *   mobile:  string | null,   // Cloudinary URL for portrait/mobile video
 * }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { customerId } = await params;

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required" },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        videoUrlDesktop: true,
        videoUrlMobile: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: `Customer '${customerId}' not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        desktop: customer.videoUrlDesktop ?? null,
        mobile: customer.videoUrlMobile ?? null,
      },
      {
        status: 200,
        headers: {
          // Allow WordPress frontend to fetch from a different origin
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("[Diamas Videos] Fetch failed:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch video URLs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/videos/[customerId]
 *
 * Clears video URLs from the database (does not delete from Cloudinary to avoid accidental loss).
 * Accepts optional query param: ?variant=desktop|mobile
 * Without variant, clears both.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { customerId } = await params;
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get("variant");

    let updateData: { videoUrlDesktop?: null; videoUrlMobile?: null } = {};

    if (!variant || variant === "desktop") {
      updateData.videoUrlDesktop = null;
    }
    if (!variant || variant === "mobile") {
      updateData.videoUrlMobile = null;
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Diamas Videos] Delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
