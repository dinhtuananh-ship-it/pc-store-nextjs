export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  PAID: "Đã thanh toán",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_METHODS = ["COD", "BANK", "MOMO"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK: "Chuyển khoản ngân hàng (giả lập)",
  MOMO: "Ví MoMo (giả lập)",
};

// Trạng thái được tính doanh thu
export const REVENUE_STATUSES: OrderStatus[] = ["PAID", "SHIPPING", "COMPLETED"];
