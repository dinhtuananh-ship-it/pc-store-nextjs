"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatVND } from "@/lib/format";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  type OrderStatus,
} from "@/constants/order";
import OrderStatusBadge from "@/components/client/OrderStatusBadge";
import { cn } from "@/lib/utils";
import type { FinanceStats, Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [finance, setFinance] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("PENDING");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [o, f] = await Promise.all([
        api.get<Order[]>(
          statusFilter ? `/api/admin/orders?status=${statusFilter}` : "/api/admin/orders"
        ),
        api.get<FinanceStats>("/api/admin/finance"),
      ]);
      setOrders(o.data ?? []);
      setFinance(f.data ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tải thất bại");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function openDetail(order: Order) {
    setSelected(order);
    setNewStatus(order.status as OrderStatus);
  }

  async function onUpdateStatus() {
    if (!selected) return;
    try {
      setSaving(true);
      const res = await api.put<Order>(
        `/api/orders/${selected.id}`,
        { status: newStatus },
        true
      );
      setSelected(res.data ?? null);
      toast.success("Cập nhật trạng thái thành công");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>

      {/* Tài chính */}
      {finance && (
        <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Tổng doanh thu</div>
            <div className="mt-2 text-2xl font-bold text-green-600">
              {formatVND(finance.totalRevenue)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {finance.paidOrders} đơn đã thu tiền
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Doanh thu hôm nay</div>
            <div className="mt-2 text-2xl font-bold text-blue-600">
              {formatVND(finance.todayRevenue)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {finance.todayOrders} đơn hôm nay
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Tổng đơn hàng</div>
            <div className="mt-2 text-2xl font-bold">{finance.totalOrders}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {finance.byStatus.map((s) => (
                <span key={s.status} className="text-xs text-slate-500">
                  {ORDER_STATUS_LABEL[s.status as OrderStatus]}: <b>{s.count}</b>
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Lọc theo trạng thái</div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bảng đơn */}
      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-220 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Mã đơn</th>
              <th className="px-4 py-3 font-medium">Khách hàng</th>
              <th className="px-4 py-3 font-medium">Sản phẩm</th>
              <th className="px-4 py-3 font-medium">Tổng tiền</th>
              <th className="px-4 py-3 font-medium">Thanh toán</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Ngày đặt</th>
              <th className="px-4 py-3 text-right font-medium">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-blue-700">{order.code}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.fullName}</div>
                    <div className="text-xs text-slate-500">{order.phone}</div>
                  </td>
                  <td className="px-4 py-3">{order.items.length} món</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-red-600">
                    {formatVND(order.total)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {PAYMENT_METHOD_LABEL[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABEL] ??
                      order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openDetail(order)}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{selected.code}</h2>
              <button
                onClick={() => setSelected(null)}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium">Người nhận</p>
                <p className="mt-1 text-slate-600">{selected.fullName}</p>
                <p className="text-slate-600">{selected.phone}</p>
                <p className="text-slate-600">{selected.address}</p>
                {selected.city && <p className="text-slate-600">{selected.city}</p>}
                {selected.note && (
                  <p className="text-slate-600 italic">Ghi chú: {selected.note}</p>
                )}
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium">Thanh toán & trạng thái</p>
                <p className="mt-1 text-slate-600">
                  {PAYMENT_METHOD_LABEL[selected.paymentMethod as keyof typeof PAYMENT_METHOD_LABEL] ??
                    selected.paymentMethod}
                </p>
                <p className="mt-1">
                  <OrderStatusBadge status={selected.status} />
                </p>
                <div className="mt-2 flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="h-9 flex-1 rounded-lg border bg-white px-2 text-sm outline-none"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={onUpdateStatus}
                    disabled={saving || newStatus === selected.status}
                    className={cn(
                      "rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40"
                    )}
                  >
                    {saving ? "Lưu..." : "Cập nhật"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              {selected.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-t py-2 text-sm">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 font-medium">{item.productName}</div>
                    <div className="text-xs text-slate-500">
                      {formatVND(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatVND(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 text-sm font-bold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatVND(selected.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
