import {SidebarProvider, SidebarTrigger, SidebarInset} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { cookies } from "next/headers";

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
        <SidebarProvider defaultOpen={sidebarOpen}>
              <DashboardSidebar />
              <SidebarInset className="min-h-0 min-w-0">
              <main className="flex flex-col min-h-0 flex-1">
                <SidebarTrigger className="md:hidden" />
                {children}
              </main>
                
              </SidebarInset>
            </SidebarProvider>
      </main>
    </div>
  )
}