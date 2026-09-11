import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type RegisterInput = z.infer<typeof registerSchema>;