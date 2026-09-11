"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatVND } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import type { Cart } from "@/types";

export default function CartPage() {
  const { user, loading: authLoading, refreshCart } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await api.get<Cart>("/api/cart", true);
      setCart(res.data ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tải giỏ hàng thất bại");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    try {
      await api.put(`/api/cart/items/${itemId}`, { quantity }, true);
      await load();
      await refreshCart();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cập nhật thất bại");
    }
  }

  async function removeItem(itemId: string) {
    try {
      await api.del(`/api/cart/items/${itemId}`, true);
      toast.success("Đã xóa sản phẩm khỏi giỏ");
      await load();
      await refreshCart();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }

  async function clearCart() {
    if (!confirm("Xóa toàn bộ giỏ hàng?")) return;
    try {
      await api.del("/api/cart/clear", true);
      toast.success("Đã xóa toàn bộ giỏ hàng");
      await load();
      await refreshCart();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }

  if (authLoading || loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>;
  }

  const items = cart?.items ?? [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Giỏ hàng ({items.length})</h1>
        <button onClick={clearCart} className="text-sm text-red-600 hover:underline">
          Xóa tất cả
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-xl border bg-white p-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {item.product.images?.[0] && (
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.productId}`}
                  className="line-clamp-2 text-sm font-medium hover:text-blue-600"
                >
                  {item.product.name}
                </Link>
                <div className="mt-1 text-sm font-bold text-red-600">
                  {formatVND(item.product.price)}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex size-8 items-center justify-center hover:bg-slate-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex size-8 items-center justify-center hover:bg-slate-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Tóm tắt đơn hàng</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính</span>
              <span>{formatVND(total)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">{formatVND(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-4 block w-full rounded-lg bg-red-600 py-3 text-center text-sm font-semibold text-white hover:bg-red-500"
          >
            Tiến hành đặt hàng
          </Link>
          <Link
            href="/products"
            className="mt-2 block text-center text-sm text-blue-600 hover:underline"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
