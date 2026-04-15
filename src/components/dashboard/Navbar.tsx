"use client";

import { Nav } from "react-day-picker";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();   
  return (
    <nav className="sticky flex w-[95%] p-2 justify-between ml-auto mr-auto my-3 bg-[oklch(0.6 0.118 184.704)]">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <p>Resonance</p>
      </div>
      <UserButton />
    </nav>
  );
}
