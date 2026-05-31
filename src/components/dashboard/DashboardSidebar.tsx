"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import {
  AudioLines,
  Headphones,
  Home,
  LayoutGrid,
  type LucideIcon,
  Settings,
  Volume2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "../ui/tooltip";

interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavSectionProps {
  label?: string;
  items: MenuItem[];
  pathname: string;
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  
  const mainMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/app", icon: Home },
    { title: "Voice Library", url: "/app/voices", icon: LayoutGrid },
    { title: "Text to Speech", url: "/app/text-to-speech", icon: AudioLines },
    { title: "Voice Cloning", url: "/app/voice-cloning", icon: Volume2 },
  ];

  const otherMenuItems: MenuItem[] = [
    { title: "Studio Settings", url: "/app/settings", icon: Settings },
    { title: "Help & Support", url: "/app/support", icon: Headphones },
  ];

  function NavSection({ label, items, pathname }: NavSectionProps) {
    return (
      <SidebarGroup className="border-b border-white/5 py-4">
        {label && (
          <SidebarGroupLabel className="font-sans text-[10px] uppercase text-[#948880] tracking-[0.2em] px-4 mb-2 h-auto flex items-center gap-2 font-medium">
            <Sparkles className="w-3 h-3 text-[#e0a96d]" />
            {label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1 px-2">
            {items.map((item) => {
              const isActive = item.url
                ? item.url === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.url)
                : false;

              return (
                <SidebarMenuItem key={item.title}>
                  <TooltipProvider>
                    <SidebarMenuButton
                      asChild={!!item.url}
                      isActive={isActive}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                        item.onClick?.();
                      }}
                      tooltip={item.title}
                      className={`font-sans text-xs tracking-wider h-10 rounded-xl border transition-all duration-300 ${
                        isActive 
                          ? "bg-[#e0a96d]/10 text-[#e0a96d] border-[#e0a96d]/20 hover:bg-[#e0a96d]/15 hover:text-[#e0a96d]" 
                          : "text-[#948880] border-transparent hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      {item.url ? (
                        <Link href={item.url} className="flex items-center gap-3 w-full px-2">
                          <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#e0a96d]" : "text-[#555]"}`} />
                          <span className="font-light">{item.title}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 w-full px-2">
                          <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#e0a96d]" : "text-[#555]"}`} />
                          <span className="font-light">{item.title}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </TooltipProvider>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-white/5 bg-[#0b0908]">
      {/* Brand Header */}
      <SidebarHeader className="flex flex-col gap-4 pt-6 pb-4 bg-[#0b0908] border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 transition-opacity"
        >
          <div className="w-12 h-12 bg-transparent flex items-center justify-center shrink-0 relative">
            <Image src="/logo.png" alt="Resonance Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-sans font-light tracking-[0.2em] uppercase text-white text-xs">
              RESONANCE
            </span>
            <span className="font-sans text-[9px] text-[#948880] tracking-widest uppercase mt-0.5">
              Atelier Space
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Space */}
      <SidebarContent className="bg-[#0b0908] scrollbar-none">
        <NavSection items={mainMenuItems} pathname={pathname} />
        <NavSection label="Preferences" items={otherMenuItems} pathname={pathname} />
      </SidebarContent>
      
      <SidebarRail />

      {/* Profile/User Menu Footer Container */}
      <SidebarFooter className="border-t border-white/5 p-4 bg-[#0e0c0b]">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center group-data-[collapsible=icon]:justify-center">
            <UserButton
              showName={state === "expanded"}
              appearance={{
                elements: {
                  userButtonBox: "flex-row-reverse gap-3 font-sans text-xs font-light text-[#948880] hover:text-white transition-colors uppercase tracking-wider",
                  avatarBox: "rounded-xl border border-white/10 w-8 h-8",
                }
              }}
              fallback={
                <Skeleton className="w-8 h-8 rounded-xl border border-white/5 bg-white/[0.02]" />
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}