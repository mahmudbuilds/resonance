import { cookies } from "next/headers";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Navbar from "@/components/dashboard/Navbar";
import { HapticsProvider } from "@/components/haptics/HapticsProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const sidebarCookie = cookiesStore.get("sidebar_state")?.value;
  const sidebarOpen = sidebarCookie !== "false";

  return (
    <SidebarProvider
      defaultOpen={sidebarOpen}
      style={{ "--sidebar-width-icon": "4.25rem" } as React.CSSProperties}
    >
      <DashboardSidebar />
      <SidebarInset className="min-h-[100dvh] min-w-0 bg-background">
        <Navbar />
        <main className="flex flex-col min-h-0 flex-1">
          <HapticsProvider>{children}</HapticsProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
