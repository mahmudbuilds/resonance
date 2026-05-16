"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Search, Terminal, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        
        {/* Center: Command Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444] group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="RUN_COMMAND..."
              className="w-full bg-[#0a0a0a] border border-[#222] focus:border-primary/50 outline-none h-9 pl-9 pr-12 font-mono text-[10px] uppercase tracking-widest transition-all placeholder:text-[#333] text-white"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 border border-[#222] bg-[#111] pointer-events-none">
              <Command className="w-2.5 h-2.5 text-[#666]" />
              <span className="font-mono text-[8px] text-[#666]">K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-primary/60 mr-2">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
            <span>SYSTEM_LIVE</span>
          </div>

          <div className="h-6 w-px bg-[#222] hidden sm:block" />
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-none border border-[#333] hover:border-primary transition-colors p-0.5 bg-[#0a0a0a]",
                userButtonPopoverCard: "rounded-none border-[#222] bg-black shadow-none",
                userButtonPopoverActionButton: "rounded-none hover:bg-primary/10",
                userButtonPopoverActionButtonText: "font-mono uppercase text-[10px] tracking-widest",
              }
            }}
          />
        </div>
        
      </div>
    </header>
  );
}
