"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Banknote, CreditCard, MapPin, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { formatVND } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { PAYMENT_METHOD_LABEL, type PaymentMethod } from "@/constants/order";
import { cn } from "@/lib/utils";
import type { Cart, Order } from "@/types";

const METHODS: { value: PaymentMethod; icon: typeof Banknote; hint: string }[] = [
  { value: "COD", icon: Banknote, hint: "Trả tiền mặt khi nhận hàng" },
  { value: "BANK", icon: CreditCard, hint: "Giả lập: quét mã QR ngân hàng" },
  { value: "MOMO", icon: Wallet, hint: "Giả lập: thanh toán qua ví MoMo" },
];

export default function CheckoutPage() {
  const { user, loading: authLoading, refreshCart } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setFullName(user.fullName);
    async function load() {
      try {
        setLoading(true);
        const res = await api.get<Cart>("/api/cart", true);
        setCart(res.data ?? null);
        if ((res.data?.items.length ?? 0) === 0) {
          toast.info("Giỏ hàng trống");
          router.push("/products");
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Tải giỏ hàng thất bại");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authLoading, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post<Order>(
        "/api/checkout",
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim() || undefined,
          note: note.trim() || undefined,
          paymentMethod,
        },
        true
      );
      await refreshCart();
      const order = res.data as Order;
      toast.success(
        paymentMethod === "COD"
          ? "Đặt hàng thành công!"
          : "Thanh toán (giả lập) thành công!"
      );
      router.push(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đặt hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>;
  }

  const items = cart?.items ?? [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const inputCls =
    "mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold">Thanh toán</h1>

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Địa chỉ */}
          <div className="rounded-xl border bg-white p-4 md:p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <MapPin size={18} className="text-blue-600" /> Địa chỉ nhận hàng
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Họ tên *</label>
                <input required minLength={3} value={fullName}
                  onChange={(e) => setFullName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-medium">Số điện thoại *</label>
                <input required value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901 234 567" className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Địa chỉ *</label>
                <input required minLength={5} value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-medium">Tỉnh / Thành phố</label>
                <input value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="TP. Hồ Chí Minh" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-medium">Ghi chú</label>
                <input value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Giao giờ hành chính..." className={inputCls} />
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="rounded-xl border bg-white p-4 md:p-6">
            <h2 className="font-semibold">Phương thức thanh toán</h2>
            <div className="mt-3 space-y-2">
              {METHODS.map((m) => (
                <label
                  key={m.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition",
                    paymentMethod === m.value
                      ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                      : "hover:border-slate-300"
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)}
                    className="size-4"
                  />
                  <span className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <m.icon size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {PAYMENT_METHOD_LABEL[m.value]}
                    </span>
                    <span className="block text-xs text-slate-500">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === "BANK" && (
              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-medium">Thông tin chuyển khoản (giả lập):</p>
                <p className="mt-1 text-slate-600">Ngân hàng: Vietcombank</p>
                <p className="text-slate-600">STK: 1234 5678 90 — Chủ TK: PC STORE</p>
                <p className="text-slate-600">
                  Nội dung: thanh toán đơn hàng • Số tiền:{" "}
                  <b className="text-red-600">{formatVND(total)}</b>
                </p>
                <p className="mt-2 text-xs text-amber-600">
                  * Đây là thanh toán giả lập — bấm “Đặt hàng” hệ thống tự ghi nhận đã thanh toán.
                </p>
              </div>
            )}

            {paymentMethod === "MOMO" && (
              <div className="mt-3 rounded-xl bg-pink-50 p-4 text-sm">
                <p className="font-medium text-pink-700">Thanh toán MoMo (giả lập):</p>
                <p className="mt-1 text-slate-600">
                  SĐT ví nhận: 0901 234 567 (PC Store) • Số tiền:{" "}
                  <b className="text-red-600">{formatVND(total)}</b>
                </p>
                <p className="mt-2 text-xs text-amber-600">
                  * Đây là thanh toán giả lập — bấm “Đặt hàng” hệ thống tự ghi nhận đã thanh toán.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tóm tắt */}
        <div className="h-fit rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Đơn hàng ({items.length})</h2>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <div className="relative size-10 shrink-0 overflow-hidden rounded bg-slate-100">
                  {item.product.images?.[0] && (
                    <Image src={item.product.images[0].imageUrl} alt="" fill className="object-cover" />
                  )}
                </div>
                <span className="line-clamp-1 flex-1">{item.product.name}</span>
                <span className="text-slate-500">x{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2 border-t pt-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính</span>
              <span>{formatVND(total)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">{formatVND(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="mt-4 w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          >
            {submitting
              ? "Đang xử lý..."
              : paymentMethod === "COD"
                ? "Đặt hàng"
                : `Thanh toán ${formatVND(total)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
