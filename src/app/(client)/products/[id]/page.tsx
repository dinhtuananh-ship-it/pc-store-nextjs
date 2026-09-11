"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { formatVND } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, refreshCart } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get<Product>(`/api/products/${id}`);
        const detail = res.data as Product;
        setProduct(detail);

        const all = await api.get<Product[]>("/api/products");
        setRelated(
          (all.data ?? [])
            .filter((p) => p.id !== id && p.categoryId === detail.categoryId)
            .slice(0, 4)
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Không tải được sản phẩm");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function addToCart(qty: number, buyNow = false) {
    if (!user) {
      toast.info("Vui lòng đăng nhập để mua hàng");
      router.push("/login");
      return;
    }
    try {
      setAdding(true);
      await api.post("/api/cart", { productId: id, quantity: qty }, true);
      await refreshCart();
      if (buyNow) {
        router.push("/cart");
      } else {
        toast.success("Đã thêm vào giỏ hàng");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Thêm giỏ hàng thất bại");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-slate-500">Không tìm thấy sản phẩm.</p>
        <Link href="/products" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const images = product.images ?? [];
  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-blue-600">Sản phẩm</Link>
        <ChevronRight size={12} />
        <span className="truncate text-slate-700">{product.name}</span>
      </div>

      <div className="mt-4 grid gap-6 rounded-xl border bg-white p-4 md:grid-cols-2 md:p-6">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            {images[activeImage] ? (
              <Image
                src={images[activeImage].imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-slate-400">
                Chưa có ảnh
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative size-16 overflow-hidden rounded-lg border bg-slate-100",
                    i === activeImage && "ring-2 ring-blue-500"
                  )}
                >
                  <Image src={img.imageUrl} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-xs text-slate-500">
            {product.brand?.name} • {product.category?.name}
          </div>
          <h1 className="mt-1 text-xl font-bold md:text-2xl">{product.name}</h1>
          <div className="mt-3 text-3xl font-extrabold text-red-600">
            {formatVND(product.price)}
          </div>
          <div className="mt-2 text-sm">
            Tình trạng:{" "}
            {outOfStock ? (
              <span className="font-semibold text-red-600">Hết hàng</span>
            ) : (
              <span className="font-semibold text-green-600">
                Còn hàng ({product.stock})
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-10 items-center justify-center hover:bg-slate-100"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                className="flex size-10 items-center justify-center hover:bg-slate-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => addToCart(quantity)}
              disabled={adding || outOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-40"
            >
              <ShoppingCart size={18} /> Thêm vào giỏ
            </button>
            <button
              onClick={() => addToCart(quantity, true)}
              disabled={adding || outOfStock}
              className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">Sản phẩm liên quan</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="overflow-hidden rounded-xl border bg-white transition hover:shadow"
              >
                <div className="relative aspect-square bg-slate-100">
                  {p.images?.[0] && (
                    <Image src={p.images[0].imageUrl} alt={p.name} fill className="object-cover" />
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 min-h-10 text-sm font-medium">{p.name}</div>
                  <div className="mt-1 font-bold text-red-600">{formatVND(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
