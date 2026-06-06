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
  const sidebarOpen = cookiesStore.get("sidebar_state")?.value === "true";
  return (
    <div>
      <main>
        <SidebarProvider
          defaultOpen={sidebarOpen}
          style={{ "--sidebar-width-icon": "4.5rem" } as React.CSSProperties}
        >
          <DashboardSidebar />
          <SidebarInset className="min-h-0 min-w-0">
            <main className="flex flex-col min-h-0 flex-1">
              <Navbar />
              <HapticsProvider>{children}</HapticsProvider>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
}
