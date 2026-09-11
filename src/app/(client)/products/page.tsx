"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/client/ProductCard";
import type { Brand, Category, Product } from "@/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category") ?? "");
  const [brandId, setBrandId] = useState(searchParams.get("brand") ?? "");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [p, c, b] = await Promise.all([
          api.get<Product[]>("/api/products"),
          api.get<Category[]>("/api/categories"),
          api.get<Brand[]>("/api/brands"),
        ]);
        setProducts(p.data ?? []);
        setCategories(c.data ?? []);
        setBrands(b.data ?? []);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Tải sản phẩm thất bại");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
    setCategoryId(searchParams.get("category") ?? "");
    setBrandId(searchParams.get("brand") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    let list = products.filter((p) => p.status);
    if (kw) list = list.filter((p) => p.name.toLowerCase().includes(kw));
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (brandId) list = list.filter((p) => p.brandId === brandId);

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, keyword, categoryId, brandId, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>

      <div className="mt-4 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-10 rounded-lg border bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="h-10 flex-1 rounded-lg border bg-white px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Tất cả hãng</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg border bg-white px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-slate-500">
            Tìm thấy {filtered.length} sản phẩm
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-slate-500">Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
