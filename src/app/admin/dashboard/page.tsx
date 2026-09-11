import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import { DashboardController } from "@/controllers/dashboard.controller";
import { OrderController } from "@/controllers/order.controller";

function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPage() {
  const controller = new DashboardController();
  const orderController = new OrderController();

  const [data, finance] = await Promise.all([
    controller.getStatistics(),
    orderController.getFinance(),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        <StatCard title="Danh mục" value={data.totalCategories} href="/admin/categories" />
        <StatCard title="Thương hiệu" value={data.totalBrands} href="/admin/brands" />
        <StatCard title="Sản phẩm" value={data.totalProducts} href="/admin/products" />
        <StatCard title="Người dùng" value={data.totalUsers} href="/admin/users" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 xl:grid-cols-4">
        <Link
          href="/admin/orders"
          className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white shadow transition hover:shadow-md"
        >
          <div className="text-green-100">Tổng doanh thu</div>
          <div className="mt-3 text-2xl font-bold">
            {formatVND(finance.totalRevenue)}
          </div>
          <div className="mt-1 text-xs text-green-100">
            {finance.paidOrders} đơn đã thu tiền
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow transition hover:shadow-md"
        >
          <div className="text-blue-100">Doanh thu hôm nay</div>
          <div className="mt-3 text-2xl font-bold">
            {formatVND(finance.todayRevenue)}
          </div>
          <div className="mt-1 text-xs text-blue-100">
            {finance.todayOrders} đơn hôm nay
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl bg-white p-6 shadow transition hover:shadow-md"
        >
          <div className="text-gray-500">Tổng đơn hàng</div>
          <div className="mt-3 text-4xl font-bold">{finance.totalOrders}</div>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="font-semibold">Thao tác nhanh</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Quản lý sản phẩm
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Quản lý danh mục
          </Link>
          <Link
            href="/admin/brands"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Quản lý thương hiệu
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Quản lý đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
