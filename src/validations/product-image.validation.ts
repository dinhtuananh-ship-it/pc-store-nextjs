import { z } from "zod";

export const createProductImageSchema = z.object({
  productId: z.string(),
  imageUrl: z.string().url(),
});

export type CreateProductImageInput =
  z.infer<typeof createProductImageSchema>;