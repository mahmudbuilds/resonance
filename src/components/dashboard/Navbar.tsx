"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Terminal } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();   
  
  const formattedPath = pathname
    ?.split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'DASHBOARD';

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-[#222]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 w-full">
        
        {/* Left: Branding & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-[#888] hover:text-primary transition-colors hover:bg-transparent" />
          
          <div className="hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 text-primary bg-primary/5 px-2 py-1 border border-primary/20">
              <Terminal className="w-3 h-3" />
              <span>RESONANCE</span>
            </div>
            <span className="text-[#333]">/</span>
            <span className="text-[#888]">{formattedPath}</span>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-primary/60 mr-2">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
            <span>SYSTEM_LIVE</span>
          </div>

          <div className="h-6 w-px bg-[#222] hidden sm:block" />
          
          <UserButton />
        </div>
        
      </div>
    </header>
  );
}
