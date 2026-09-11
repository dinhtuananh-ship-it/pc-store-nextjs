"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(email.trim(), password);
      toast.success(`Chào mừng ${user.fullName}!`);
      if (user.role?.name === "Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Cpu size={22} />
          </span>
          Đăng nhập
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Chào mừng bạn quay lại PC Store
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@example.com"
              className="mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          Tài khoản admin demo: <b>admin@pcstore.vn</b> / <b>admin123</b>
        </p>
      </div>
    </div>
  );
}
