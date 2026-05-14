"use client";
import { UserButton, useClerk } from "@clerk/nextjs";
import {
  AudioLines,
  Headphones,
  Home,
  LayoutGrid,
  type LucideIcon,
  Settings,
  Volume2,
  Terminal,
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
  const { state, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const mainMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/app", icon: Home },
    { title: "Voice Registry", url: "/app/voices", icon: LayoutGrid },
    { title: "Text to Speech", url: "/app/text-to-speech", icon: AudioLines },
    { title: "Voice Cloning", url: "/app/voice-cloning", icon: Volume2 },
  ];

  const otherMenuItems: MenuItem[] = [
    { title: "System Config", url: "/app/settings", icon: Settings },
    {
      title: "Support Comm",
      url: "/app/support",
      icon: Headphones,
    },
  ];

  function NavSection({ label, items, pathname }: NavSectionProps) {
    return (
      <SidebarGroup className="border-b border-[#222] rounded-none py-4">
        {label && (
          <SidebarGroupLabel className="font-mono text-[10px] uppercase text-[#666] tracking-widest px-4 mb-2 h-auto flex items-center gap-2">
            <Terminal className="w-3 h-3 text-[#444]" />
            {label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
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
                        if (isMobile) setOpen(false);
                        item.onClick?.();
                      }}
                      tooltip={item.title}
                      className={`my-1 font-mono text-xs tracking-wider uppercase h-10 rounded-none border border-transparent ${
                        isActive 
                          ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary" 
                          : "text-[#888] hover:text-white hover:bg-[#111] hover:border-[#333]"
                      }`}
                    >
                      {item.url ? (
                        <Link href={item.url} className="flex items-center gap-3 w-full px-2">
                          <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-[#555]"}`} />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 w-full px-2">
                          <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-[#555]"}`} />
                          <span>{item.title}</span>
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
    <Sidebar variant="inset" collapsible="icon" className="border-r border-[#222] bg-black">
      <SidebarHeader className="flex flex-col gap-4 pt-6 pb-4 border-b border-[#222]">
        <div className="flex items-center gap-3 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="w-8 h-8 bg-primary flex items-center justify-center shrink-0">
            <AudioLines className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-heading font-black tracking-widest uppercase text-white text-sm">
              RESONANCE
            </span>
            <span className="font-mono text-[8px] text-primary tracking-widest uppercase">
              SYS.ONLINE // V2.0.4
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black scrollbar-none">
        <NavSection items={mainMenuItems} pathname={pathname} />
        <NavSection label="Parameters" items={otherMenuItems} pathname={pathname} />
      </SidebarContent>
      
      <SidebarRail />

      <SidebarFooter className="border-t border-[#222] p-4 bg-[#050505]">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center group-data-[collapsible=icon]:justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "rounded-none w-8 h-8 border border-[#444] hover:border-primary transition-colors",
                  userButtonPopoverCard: "rounded-none border border-[#222] bg-[#050505] font-mono",
                },
              }}
              showName={state === "expanded"}
              fallback={
                <Skeleton className="w-8 h-8 rounded-none border border-[#333] bg-[#111]" />
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
