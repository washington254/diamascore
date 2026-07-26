import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  type VideoVariant,
  uploadVideoToCloudinary,
} from "@/lib/cloudinary";

// Next.js 14+ App Router – disable default body parser to handle multipart/form-data
export const runtime = "nodejs";

/**
 * POST /api/videos/upload
 *
 * Accepts a multipart/form-data payload from the WordPress plugin:
 *   - customerId  (string, required) – the WP plugin's registered customer UUID
 *   - variant     ('desktop' | 'mobile', required)
 *   - video       (File, required) – the raw video file
 *   - nonce       (string, required) – secret shared between WP plugin and Diamas Core
 *
 * Returns: { url: string } – the Cloudinary HTTPS URL saved in the DB.
 */
export async function POST(request: NextRequest) {
  try {
    // ─── 1. Require the server-to-server shared secret ──────────────────────
    const expectedNonce = process.env.DIAMAS_WP_NONCE;
    if (!expectedNonce) {
      console.error("[Diamas Videos] DIAMAS_WP_NONCE is not configured");
      return NextResponse.json(
        { error: "Video uploads are not configured" },
        { status: 503 },
      );
    }

    const nonce = request.headers.get("x-diamas-nonce");
    if (nonce !== expectedNonce) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ─── 2. Parse the multipart form ────────────────────────────────────────
    const formData = await request.formData();
    const customerId = formData.get("customerId")?.toString() ?? "";
    const variant = formData.get("variant")?.toString();
    const videoFile = formData.get("video");

    if (!customerId || !variant || !videoFile) {
      return NextResponse.json(
        { error: "Missing required fields: customerId, variant, video" },
        { status: 400 },
      );
    }

    if (!(videoFile instanceof File) || videoFile.size === 0) {
      return NextResponse.json(
        { error: "video must be a non-empty uploaded file" },
        { status: 400 },
      );
    }

    if (variant !== "desktop" && variant !== "mobile") {
      return NextResponse.json(
        { error: "variant must be 'desktop' or 'mobile'" },
        { status: 400 },
      );
    }

    // ─── 3. Verify the customer exists in our DB ─────────────────────────────
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { error: `Customer '${customerId}' not found` },
        { status: 404 },
      );
    }

    // ─── 4. Read file bytes & upload to Cloudinary ───────────────────────────
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      `[Diamas Videos] Uploading ${variant} video for customer ${customerId} — ${buffer.byteLength} bytes`,
    );

    const cloudinaryUrl = await uploadVideoToCloudinary(
      buffer,
      customerId,
      variant as VideoVariant,
    );

    console.log(`[Diamas Videos] Cloudinary URL: ${cloudinaryUrl}`);

    // ─── 5. Save the URL in the database ─────────────────────────────────────
    const updateData =
      variant === "desktop"
        ? { videoUrlDesktop: cloudinaryUrl }
        : { videoUrlMobile: cloudinaryUrl };

    await prisma.customer.update({
      where: { id: customerId },
      data: updateData,
    });

    // ─── 6. Return the URL to WordPress ──────────────────────────────────────
    return NextResponse.json(
      { url: cloudinaryUrl, variant },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Diamas Videos] Upload failed:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
