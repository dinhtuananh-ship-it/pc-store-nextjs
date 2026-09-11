"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    try {
      setSubmitting(true);
      await register(fullName.trim(), email.trim(), password);
      toast.success("Đăng ký thành công!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đăng ký thất bại");
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
          Đăng ký
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Tạo tài khoản để mua sắm tại PC Store
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Họ tên</label>
            <input
              required
              minLength={3}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
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
              placeholder="Tối thiểu 6 ký tự"
              className="mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nhập lại mật khẩu</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
