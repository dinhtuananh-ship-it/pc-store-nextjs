import { ORDER_STATUS_LABEL, type OrderStatus } from "@/constants/order";
import { cn } from "@/lib/utils";

const COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-violet-100 text-violet-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-slate-200 text-slate-600",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const key = status as OrderStatus;
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        COLORS[key] ?? "bg-slate-200 text-slate-600"
      )}
    >
      {ORDER_STATUS_LABEL[key] ?? status}
    </span>
  );
}
