import { z } from "zod";

const imageSchema = z.object({
  imageUrl: z.string().url(),
  publicId: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().min(3),

  slug: z.string().min(3),

  description: z.string().optional(),

  price: z.number().positive(),

  stock: z.number().int(),

  categoryId: z.string(),

  brandId: z.string(),

  images: z.array(imageSchema).optional(),
});

export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;