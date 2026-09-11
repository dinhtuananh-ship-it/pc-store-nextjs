import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_METHODS } from "@/constants/order";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(12, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+]+$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
