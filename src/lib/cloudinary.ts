import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Keep these server-only values out of client bundles. This module is imported
// exclusively by the Node.js upload route.
cloudinary.config({
  ...cloudinaryConfig,
  secure: true,
});

export type VideoVariant = "desktop" | "mobile";

function assertCloudinaryIsConfigured() {
  if (
    !cloudinaryConfig.cloud_name ||
    !cloudinaryConfig.api_key ||
    !cloudinaryConfig.api_secret
  ) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
}

/**
 * Upload a video buffer to Cloudinary.
 * Optimizes the video with auto quality and auto format.
 *
 * @param buffer     Raw video bytes
 * @param customerId The customer's unique ID (used to namespace the asset)
 * @param variant    'desktop' or 'mobile' — determines the public_id suffix
 * @returns          The secure HTTPS URL of the uploaded video on Cloudinary
 */
export async function uploadVideoToCloudinary(
  buffer: Buffer,
  customerId: string,
  variant: VideoVariant,
): Promise<string> {
  assertCloudinaryIsConfigured();

  const publicId = `diamas/customers/${customerId}/popup_video_${variant}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        public_id: publicId,
        overwrite: true,
        // Optimise: auto quality + streaming-friendly format
        transformation: [
          {
            quality: "auto:good",
            fetch_format: "mp4",
          },
        ],
        // Tag assets for easy management
        tags: ["diamas", "popup-video", variant, customerId],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result"));
        } else {
          resolve(result as { secure_url: string });
        }
      },
    );

    uploadStream.end(buffer);
  });

  return result.secure_url;
}

/**
 * Delete a video from Cloudinary by customer ID and variant.
 */
export async function deleteVideoFromCloudinary(
  customerId: string,
  variant: VideoVariant,
): Promise<void> {
  assertCloudinaryIsConfigured();

  const publicId = `diamas/customers/${customerId}/popup_video_${variant}`;
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}

export default cloudinary;
