import Link from "next/link";
import { ArrowRight, BadgeCheck, Cpu, Headset, Truck } from "lucide-react";
import { ProductController } from "@/controllers/product.controller";
import { CategoryController } from "@/controllers/category.controller";
import { BrandController } from "@/controllers/brand.controller";
import ProductCard from "@/components/client/ProductCard";

async function getData() {
  const productController = new ProductController();
  const categoryController = new CategoryController();
  const brandController = new BrandController();

  const [products, categories, brands] = await Promise.all([
    productController.getAll(),
    categoryController.getAll(),
    brandController.findAll(),
  ]);

  return { products, categories, brands };
}

export default async function HomePage() {
  const { products, categories, brands } = await getData();
  const featured = products.filter((p) => p.status).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-14 md:py-20">
          <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/40">
            Linh kiện chính hãng • Bảo hành uy tín
          </span>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
            Build PC trong mơ với linh kiện chính hãng
          </h1>
          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            CPU, VGA, RAM, Mainboard, SSD, màn hình gaming từ ASUS, MSI,
            Gigabyte, Intel, AMD... giá tốt nhất thị trường.
          </p>
          <Link
            href="/products"
            className="mt-2 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
          >
            Mua sắm ngay <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Truck, title: "Giao hàng toàn quốc", desc: "Nhanh chóng, đóng gói cẩn thận" },
          { icon: BadgeCheck, title: "100% chính hãng", desc: "Bảo hành theo hãng" },
          { icon: Headset, title: "Tư vấn build PC", desc: "Miễn phí, tận tâm" },
          { icon: Cpu, title: "Lắp đặt tại shop", desc: "Test kỹ trước khi giao" },
        ].map((perk) => (
          <div key={perk.title} className="flex items-center gap-3 rounded-xl border bg-white p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <perk.icon size={20} />
            </span>
            <div>
              <div className="text-sm font-semibold">{perk.title}</div>
              <div className="text-xs text-slate-500">{perk.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Danh mục nổi bật</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="rounded-xl border bg-white p-4 text-center transition hover:border-blue-500 hover:shadow"
            >
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="mt-1 line-clamp-1 text-xs text-slate-500">
                {c.description}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Sản phẩm nổi bật</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">
            Chưa có sản phẩm nào.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-7xl px-4 py-6 pb-12">
        <h2 className="mb-4 text-xl font-bold">Thương hiệu</h2>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/products?brand=${b.id}`}
              className="rounded-full border bg-white px-4 py-2 text-sm font-medium transition hover:border-blue-500 hover:text-blue-600"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
