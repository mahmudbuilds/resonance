"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const formattedPath = pathname === "/app" ? "" : pathname
    ?.split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'DASHBOARD';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0908]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 w-full">
        
        {/* Left: Premium Branding & Dynamic Path Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="text-[#948880] hover:text-[#e0a96d] transition-colors hover:bg-transparent" />
          
          <div className="flex items-center gap-2 sm:gap-3 font-sans text-xs tracking-[0.15em] uppercase">
            <div className="flex items-center gap-2 text-[#e0a96d] font-light shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio</span>
            </div>
            <span className="text-white/10">/</span>
            <span className="text-[#948880] font-light truncate max-w-[120px] sm:max-w-none">
              {formattedPath}
            </span>
          </div>
        </div>

        {/* Right: Clean Status Elements & Profile Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 font-sans text-[11px] tracking-wider text-[#948880] mr-2 font-light">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e0a96d] animate-pulse" />
            <span>Workspace Active</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden md:block" />
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "rounded-xl border border-white/10 w-8 h-8",
              }
            }}
          />
        </div>
        
      </div>
    </header>
  );
}