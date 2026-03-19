import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | ARUN SA WAD",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated and is admin
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-muted/30 min-w-0">
        <div className="pt-16 px-3 pb-6 sm:px-6 sm:pt-6 lg:pt-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
