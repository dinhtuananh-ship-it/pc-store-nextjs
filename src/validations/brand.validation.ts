import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2, "Tên thương hiệu phải có ít nhất 2 ký tự"),
  slug: z.string().min(2),
  description: z.string().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;