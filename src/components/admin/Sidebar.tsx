"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderTree,
  Boxes,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Category",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Brand",
    href: "/admin/brands",
    icon: Boxes,
  },
  {
    title: "Product",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Order",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "User",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Về cửa hàng",
    href: "/",
    icon: ShoppingCart,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        PC Store Admin
      </div>

      <nav className="flex flex-col p-4 gap-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800"
            >
              <Icon size={20} />

              {menu.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}