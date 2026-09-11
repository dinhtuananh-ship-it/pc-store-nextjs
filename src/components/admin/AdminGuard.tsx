"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role?.name !== "Admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role?.name !== "Admin") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  return <>{children}</>;
}
