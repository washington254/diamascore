import { z } from "zod";

const platformSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase())
  .pipe(z.enum(["shopify", "wordpress"]))
  .transform((value) => (value === "shopify" ? "Shopify" : "WordPress"));

export const customerPayloadSchema = z.object({
  id: z.string().trim().min(1, "Customer id is required"),
  name: z.string().trim().min(1, "Customer name is required"),
  email: z.string().trim().email("A valid email is required"),
  platform: platformSchema,
  registeredDate: z
    .string()
    .trim()
    .min(1, "registeredDate is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "registeredDate must be a valid ISO date string",
    }),
  avatar: z.string().trim().optional(),
  status: z.enum(["Active", "Inactive", "Pending"]).optional(),
  popupStats: z
    .object({
      opens: z.number().int().nonnegative(),
      closes: z.number().int().nonnegative(),
      success: z.number().int().nonnegative(),
      rejection: z.number().int().nonnegative(),
    })
    .optional(),
});

export type CustomerPayload = z.infer<typeof customerPayloadSchema>;
