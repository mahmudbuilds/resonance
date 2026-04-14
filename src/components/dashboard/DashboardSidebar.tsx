"use client";
import { ModeToggle } from "../ui/mode-toggle";
import { UserButton, useClerk } from "@clerk/nextjs";
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
  SidebarTrigger,
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
  const clerk = useClerk();
  const { state } = useSidebar();
  const mainMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Explore Voices", url: "/voices", icon: LayoutGrid },
    { title: "Text to Speech", url: "/text-to-speech", icon: AudioLines },
    { title: "Voice Cloning", icon: Volume2 },
  ];

  const otherMenuItems: MenuItem[] = [
    { title: "Settings", url: "/settings", icon: Settings },
    {
      title: "Help and Support",
      url: "mailto:akinadetella@gmail.com",
      icon: Headphones,
    },
  ];

  function NavSection({ label, items, pathname }: NavSectionProps) {
    return (
      <SidebarGroup className="border-b border-dashed">
        {label && (
          <SidebarGroupLabel className="text-[13px] uppercase text-muted-foreground">
            {label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <TooltipProvider>
                  <SidebarMenuButton
                    asChild={!!item.url}
                    isActive={
                      item.url
                        ? item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                        : false
                    }
                    onClick={item.onClick}
                    tooltip={item.title}
                    className="my-2"
                  >
                    {item.url ? (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    ) : (
                      <>
                        <item.icon />
                        <span>{item.title}</span>
                      </>
                    )}
                  </SidebarMenuButton>
                </TooltipProvider>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          <Image src="/logo.png" alt="Resonance Logo" width={45} height={45} />
          <span className="group-data-[collapsible=icon]:hidden tracking-tighter">
            Resonance
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavSection items={mainMenuItems} pathname={pathname} />
        <NavSection label="Others" items={otherMenuItems} pathname={pathname} />
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter>
        <SidebarMenu>
         
          <SidebarMenuItem>
            <UserButton
              appearance={{
                elements: {
                  
                }
              }}
              showName={state === "expanded"}
              fallback={
                <Skeleton className="w-full h-8 group-data-[collapsible=icon]:size-8 border border-border border-white" />
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
