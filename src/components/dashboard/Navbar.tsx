"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Navbar() {
  const pathname = usePathname();

  const formattedPath = pathname === "/app" ? "" : pathname
    ?.split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Dashboard';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border h-16 flex items-center">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 w-full h-full">
        
        {/* Left: Branding & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-lg" />
          
          <div className="flex items-center gap-2 sm:gap-3 font-sans text-sm font-medium text-foreground/80">
            <div className="flex items-center gap-2 text-primary font-semibold shrink-0">
              <Sparkles className="w-4 h-4" />
              <span>Studio</span>
            </div>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground truncate max-w-[120px] sm:max-w-none">
              {formattedPath}
            </span>
          </div>
        </div>

        {/* Right: Status & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 font-sans text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span>Workspace Active</span>
          </div>

          <div className="h-5 w-px bg-border hidden md:block" />
          
          <ModeToggle />

          <div className="hover:scale-105 transition-transform duration-200">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "rounded-xl border border-border w-9 h-9 shadow-lg shadow-primary/20",
                }
              }}
            />
          </div>
        </div>
        
      </div>
    </header>
  );
}
