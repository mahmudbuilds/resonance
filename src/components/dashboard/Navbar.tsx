"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();   
  
  const formattedPath = pathname
    ?.split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Dashboard';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/40">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10 w-full">
        
        {/* Left: Branding & Breadcrumbs */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-[200px]">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
          
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <span className="text-foreground font-semibold tracking-tight">Resonance</span>
            <span className="text-muted-foreground/30 font-light">/</span>
            <span className="text-muted-foreground">{formattedPath}</span>
          </div>
        </div>
        
        {/* Center: Command Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <Button variant="outline" className="w-full justify-start text-sm text-muted-foreground bg-muted/20 border-border/50 shadow-sm h-9 px-4 rounded-full hover:bg-muted/50 hover:text-foreground transition-all">
            <Search className="w-4 h-4 mr-2 opacity-50" />
            <span className="font-normal opacity-70">Search workspace...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-[200px] justify-end">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:flex">
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="h-5 w-px bg-border/50 hidden sm:block" />
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-border/50 shadow-sm hover:scale-105 transition-transform",
              }
            }}
          />
        </div>
        
      </div>
    </header>
  );
}
