import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Navbar from "@/components/dashboard/Navbar";
import { HapticsProvider } from "@/components/haptics/HapticsProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="studio-theme min-h-[100dvh] bg-background text-foreground flex flex-col lg:flex-row">
      <DashboardSidebar />
      <Navbar />

      <div className="flex-1 min-w-0 flex flex-col lg:py-3.5 lg:pr-3.5">
        <main className="bento-canvas flex-1 min-w-0 flex flex-col lg:rounded-[30px] overflow-x-clip">
          <HapticsProvider>{children}</HapticsProvider>
        </main>
      </div>
    </div>
  );
}
