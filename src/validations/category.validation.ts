import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;