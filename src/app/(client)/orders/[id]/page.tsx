"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatVND } from "@/lib/format";
import {
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  type OrderStatus,
} from "@/constants/order";
import { useAuth } from "@/context/AuthContext";
import OrderStatusBadge from "@/components/client/OrderStatusBadge";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

const STEPS: OrderStatus[] = ["PENDING", "PAID", "SHIPPING", "COMPLETED"];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get<Order>(`/api/orders/${id}`, true);
      setOrder(res.data ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tải đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    load();
  }, [authLoading, user, router, load]);

  async function doAction(action: "pay" | "cancel") {
    if (action === "cancel" && !confirm("Bạn chắc chắn muốn hủy đơn này?")) return;
    try {
      setActing(true);
      const res = await api.put<Order>(`/api/orders/${id}`, { action }, true);
      setOrder(res.data ?? null);
      toast.success(
        action === "pay" ? "Thanh toán (giả lập) thành công!" : "Đã hủy đơn hàng"
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Thất bại");
    } finally {
      setActing(false);
    }
  }

  if (authLoading || loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Không tìm thấy đơn hàng.</p>
        <Link href="/orders" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const stepIndex =
    order.status === "CANCELLED" ? -1 : STEPS.indexOf(order.status as OrderStatus);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link href="/orders" className="hover:text-blue-600">Đơn hàng</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700">{order.code}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{order.code}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Tracking */}
      <div className="mt-4 rounded-xl border bg-white p-4 md:p-6">
        {order.status === "CANCELLED" ? (
          <p className="text-sm text-slate-500">
            Đơn hàng đã bị hủy{order.paymentMethod !== "COD" ? " — tiền (giả lập) sẽ được hoàn lại." : "."}
          </p>
        ) : (
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                      i <= stepIndex ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {i <= stepIndex ? <Check size={16} /> : i + 1}
                  </span>
                  <span className="whitespace-nowrap text-[11px] text-slate-600">
                    {ORDER_STATUS_LABEL[step]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("mx-1 mb-5 h-0.5 flex-1", i < stepIndex ? "bg-green-600" : "bg-slate-200")} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {order.status === "PENDING" && order.paymentMethod !== "COD" && (
            <button
              onClick={() => doAction("pay")}
              disabled={acting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Thanh toán ngay (giả lập)
            </button>
          )}
          {order.status === "PENDING" && (
            <button
              onClick={() => doAction("cancel")}
              disabled={acting}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 md:col-span-2">
          <h2 className="font-semibold">Sản phẩm</h2>
          <div className="mt-3 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-medium">{item.productName}</div>
                  <div className="text-xs text-slate-500">x{item.quantity}</div>
                </div>
                <div className="text-sm font-semibold">
                  {formatVND(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">{formatVND(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Người nhận</h2>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              <p className="font-medium text-slate-900">{order.fullName}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
              {order.city && <p>{order.city}</p>}
              {order.note && <p className="italic">Ghi chú: {order.note}</p>}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Thanh toán</h2>
            <p className="mt-2 text-sm text-slate-600">
              {PAYMENT_METHOD_LABEL[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABEL] ??
                order.paymentMethod}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Đặt lúc {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
