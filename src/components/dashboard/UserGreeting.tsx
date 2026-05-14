"use client"

import { useUser } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";
import { Terminal } from "lucide-react";

export default function UserGreeting() {
  const { isLoaded, user } = useUser();
  const userFirstName = user?.firstName;
  return (
    <div className="flex flex-col gap-2">
      {!isLoaded ? (
        <Spinner className="w-8 h-8 md:w-12 md:h-12 text-primary" />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="text-white">SYS_ADMIN:</span>
            <span className="text-primary font-black uppercase">
              {userFirstName || "CREATOR"}
            </span>
          </div>
          <div className="text-xl md:text-2xl font-mono text-[#666] tracking-widest mt-2 uppercase flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#444]" /> AWAITING_INPUT
          </div>
        </>
      )}
    </div>
  );
}
