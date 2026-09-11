"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { formatVND } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const { user, refreshCart } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const image = product.images?.[0]?.imageUrl;
  const outOfStock = product.stock <= 0;

  async function addToCart() {
    if (!user) {
      toast.info("Vui lòng đăng nhập để mua hàng");
      router.push("/login");
      return;
    }
    try {
      setAdding(true);
      await api.post("/api/cart", { productId: product.id, quantity: 1 }, true);
      await refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Thêm giỏ hàng thất bại");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative aspect-square bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-slate-400">
            Chưa có ảnh
          </div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            Hết hàng
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="text-xs text-slate-500">
          {product.brand?.name} • {product.category?.name}
        </div>
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 min-h-10 text-sm font-medium hover:text-blue-600"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-red-600">
            {formatVND(product.price)}
          </span>
          <button
            onClick={addToCart}
            disabled={adding || outOfStock}
            className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40"
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
