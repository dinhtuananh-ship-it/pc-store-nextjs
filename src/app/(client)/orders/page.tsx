"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatVND } from "@/lib/format";
import { PAYMENT_METHOD_LABEL } from "@/constants/order";
import { useAuth } from "@/context/AuthContext";
import OrderStatusBadge from "@/components/client/OrderStatusBadge";
import type { Order } from "@/types";

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    async function load() {
      try {
        setLoading(true);
        const res = await api.get<Order[]>("/api/orders", true);
        setOrders(res.data ?? []);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Tải đơn hàng thất bại");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Bạn chưa có đơn hàng nào.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>

      <div className="mt-4 space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-xl border bg-white p-4 transition hover:shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-700">{order.code}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <span className="text-xs text-slate-500">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {order.items.length} sản phẩm •{" "}
              {PAYMENT_METHOD_LABEL[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABEL] ??
                order.paymentMethod}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold text-red-600">
                {formatVND(order.total)}
              </span>
              <span className="flex items-center gap-1 text-sm text-blue-600">
                Chi tiết <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
