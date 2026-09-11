import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 bg-slate-100">
          <Header />

          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
