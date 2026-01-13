import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AgentSidebar } from "@/components/agent/AgentSidebar";

export const metadata = {
  title: "Agent Dashboard | ARUN SA WAD",
};

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is agent or admin
  if (session.user.role !== "AGENT" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-muted/30">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
