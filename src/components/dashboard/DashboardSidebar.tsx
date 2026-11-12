"use client";

import { UserButton } from "@clerk/nextjs";
import {
  AudioLines,
  Headphones,
  Home,
  LayoutGrid,
  type LucideIcon,
  Settings,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const mainMenuItems: MenuItem[] = [
  { title: "Overview", url: "/app", icon: Home },
  { title: "Voice Library", url: "/app/voices", icon: LayoutGrid },
  { title: "Text to Speech", url: "/app/text-to-speech", icon: AudioLines },
  { title: "Voice Cloning", url: "/app/voice-cloning", icon: Volume2 },
];

const otherMenuItems: MenuItem[] = [
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Support", url: "/app/support", icon: Headphones },
];

function NavSection({
  label,
  items,
  pathname,
  isMobile,
  setOpenMobile,
}: {
  label?: string;
  items: MenuItem[];
  pathname: string;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}) {
  return (
    <SidebarGroup className="py-2">
      {label && (
        <SidebarGroupLabel className="text-[11px] font-medium text-muted-foreground px-3 mb-1.5 h-auto">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1 px-2">
          {items.map((item) => {
            const isActive =
              item.url === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <TooltipProvider>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                    tooltip={item.title}
                    className={`text-sm font-medium h-10 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full px-2.5"
                    >
                      <item.icon
                        className={`size-4 shrink-0 ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span>{item.title}</span>
                    </Link>
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

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="h-16 flex justify-center border-b border-sidebar-border px-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <Image
            src="/logo.png"
            alt="Resonance"
            width={32}
            height={32}
            className="size-8 shrink-0 object-contain dark:invert-0 invert"
          />
          <span className="font-semibold text-sidebar-foreground text-base tracking-tight group-data-[collapsible=icon]:hidden">
            Resonance
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-3">
        <NavSection
          label="Studio"
          items={mainMenuItems}
          pathname={pathname}
          isMobile={isMobile}
          setOpenMobile={setOpenMobile}
        />
        <div className="my-2 mx-4 h-px bg-sidebar-border" />
        <NavSection
          label="Account"
          items={otherMenuItems}
          pathname={pathname}
          isMobile={isMobile}
          setOpenMobile={setOpenMobile}
        />
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <UserButton
              showName={state === "expanded"}
              appearance={{
                elements: {
                  userButtonBox:
                    "flex-row-reverse gap-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  avatarBox: "rounded-full border border-border size-8",
                },
              }}
              fallback={
                <Skeleton className="size-8 rounded-full border border-border bg-secondary" />
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
