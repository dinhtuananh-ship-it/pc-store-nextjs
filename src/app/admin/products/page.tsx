"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatVND, slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Brand, Category, Product } from "@/types";

type ImageItem = { imageUrl: string; publicId: string };

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  brandId: "",
  status: true,
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const [p, c, b] = await Promise.all([
        api.get<Product[]>("/api/products"),
        api.get<Category[]>("/api/categories"),
        api.get<Brand[]>("/api/brands"),
      ]);
      setItems(p.data ?? []);
      setCategories(c.data ?? []);
      setBrands(b.data ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tải thất bại");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
    setOpen(true);
  }

  function openEdit(item: Product) {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      price: String(item.price),
      stock: String(item.stock),
      categoryId: item.categoryId,
      brandId: item.brandId,
      status: item.status,
    });
    setImages(
      (item.images ?? []).map((img) => ({
        imageUrl: img.imageUrl,
        publicId: img.publicId,
      }))
    );
    setOpen(true);
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      for (const file of Array.from(files)) {
        const up = await api.upload(file);
        setImages((prev) => [...prev, { imageUrl: up.image, publicId: up.publicId }]);
      }
      toast.success("Upload ảnh thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Giá phải là số dương");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Tồn kho phải là số nguyên >= 0");
      return;
    }
    if (!form.categoryId || !form.brandId) {
      toast.error("Vui lòng chọn danh mục và thương hiệu");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      price,
      stock,
      categoryId: form.categoryId,
      brandId: form.brandId,
      status: form.status,
      images: images.length > 0 ? images : undefined,
    };

    try {
      setSaving(true);
      if (editing) {
        await api.put(`/api/products/${editing.id}`, payload);
        toast.success("Cập nhật thành công");
      } else {
        await api.post("/api/products", payload);
        toast.success("Thêm thành công");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: Product) {
    if (!confirm(`Xóa sản phẩm "${item.name}"?`)) return;
    try {
      await api.del(`/api/products/${item.id}`);
      toast.success("Đã xóa");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xóa thất bại");
    }
  }

  function setField<K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const inputCls =
    "mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sản phẩm</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Tồn kho</th>
              <th className="px-4 py-3 font-medium">Danh mục</th>
              <th className="px-4 py-3 font-medium">Thương hiệu</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {item.images?.[0] && (
                          <Image
                            src={item.images[0].imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="line-clamp-2 max-w-64 font-medium">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-red-600">
                    {formatVND(item.price)}
                  </td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3 text-slate-500">{item.category?.name}</td>
                  <td className="px-4 py-3 text-slate-500">{item.brand?.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        item.status
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      )}
                    >
                      {item.status ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Tên sản phẩm</label>
                <input
                  required
                  minLength={3}
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: editing ? f.slug : slugify(name),
                    }));
                  }}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Slug</label>
                <input
                  required
                  minLength={3}
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Giá (VND)</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tồn kho</label>
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  value={form.stock}
                  onChange={(e) => setField("stock", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Danh mục</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setField("categoryId", e.target.value)}
                  className={cn(inputCls, "bg-white")}
                >
                  <option value="">-- Chọn --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Thương hiệu</label>
                <select
                  required
                  value={form.brandId}
                  onChange={(e) => setField("brandId", e.target.value)}
                  className={cn(inputCls, "bg-white")}
                >
                  <option value="">-- Chọn --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.status}
                    onChange={(e) => setField("status", e.target.checked)}
                    className="size-4"
                  />
                  Hiển thị trên cửa hàng
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Hình ảnh</label>
                <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-600">
                  <Upload size={18} />
                  {uploading ? "Đang upload..." : "Chọn ảnh upload lên Cloudinary"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={onFileChange}
                    disabled={uploading}
                  />
                </label>
                {images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {images.map((img) => (
                      <div
                        key={img.publicId}
                        className="relative size-20 overflow-hidden rounded-lg border bg-slate-100"
                      >
                        <Image src={img.imageUrl} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((p) => p.publicId !== img.publicId)
                            )
                          }
                          className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
