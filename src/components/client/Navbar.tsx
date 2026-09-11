"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Cpu, LogOut, Package, Search, ShieldCheck, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
];

export default function Navbar() {
  const { user, cartCount, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const isAdmin = user?.role?.name === "Admin";

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(keyword.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-slate-900 text-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-600">
            <Cpu size={22} />
          </span>
          PC Store
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white",
                pathname === link.href && "bg-slate-800 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-amber-300 hover:bg-slate-800"
            >
              <ShieldCheck size={16} />
              Quản trị
            </Link>
          )}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden min-w-0 flex-1 max-w-sm items-center md:flex">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm CPU, VGA, RAM..."
              className="h-9 w-full rounded-lg bg-slate-800 pl-9 pr-3 text-sm outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <Link
          href="/cart"
          className="relative flex size-10 items-center justify-center rounded-lg hover:bg-slate-800"
          aria-label="Giỏ hàng"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            <Link
              href="/orders"
              className="flex size-10 items-center justify-center rounded-lg hover:bg-slate-800"
              title="Đơn hàng của tôi"
            >
              <Package size={20} />
            </Link>
            <span className="hidden max-w-32 truncate text-sm text-slate-300 lg:block">
              {user.fullName}
            </span>
            <button
              onClick={logout}
              className="flex size-10 items-center justify-center rounded-lg hover:bg-slate-800"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <User size={16} />
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
