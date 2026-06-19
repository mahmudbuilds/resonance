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
  Waves,
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
      <SidebarGroup className="py-2">
        {label && (
          <SidebarGroupLabel className="font-sans text-xs font-semibold text-muted-foreground px-4 mb-2 h-auto flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1.5 px-3">
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
                      className={`font-sans text-sm font-medium h-11 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {item.url ? (
                        <Link href={item.url} className="flex items-center gap-3 w-full px-2">
                          <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 w-full px-2">
                          <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
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
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      {/* Brand Header */}
      <SidebarHeader className="flex flex-col gap-4 pt-6 pb-4 bg-background border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="Resonance"
            width={64}
            height={64}
            className="w-14 h-14 shrink-0 object-contain group-data-[collapsible=icon]:w-16 group-data-[collapsible=icon]:h-16 dark:invert-0 invert"
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-heading font-semibold text-foreground text-lg tracking-tight">
              Resonance
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Space */}
      <SidebarContent className="bg-transparent scrollbar-none py-4">
        <NavSection items={mainMenuItems} pathname={pathname} />
        <div className="my-2 mx-6 h-px bg-accent" />
        <NavSection label="Preferences" items={otherMenuItems} pathname={pathname} />
      </SidebarContent>
      
      <SidebarRail />

      {/* Profile/User Menu Footer Container */}
      <SidebarFooter className="border-t border-border p-4 bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center group-data-[collapsible=icon]:justify-center">
            <UserButton
              showName={state === "expanded"}
              appearance={{
                elements: {
                  userButtonBox: "flex-row-reverse gap-3 font-sans text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  avatarBox: "rounded-xl border border-border w-9 h-9 shadow-lg shadow-primary/20",
                }
              }}
              fallback={
                <Skeleton className="w-9 h-9 rounded-xl border border-border bg-secondary" />
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}