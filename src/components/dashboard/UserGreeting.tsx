"use client";

import { useUser } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";

export default function UserGreeting() {
  const { isLoaded, user } = useUser();
  const userFirstName = user?.firstName;

  return (
    <div className="flex flex-col gap-1">
      {!isLoaded ? (
        <Spinner className="w-8 h-8 md:w-12 md:h-12 text-[#e0a96d]" />
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="text-foreground/60 font-light">Welcome back,</span>
            <span className="text-[#e0a96d] font-normal">
              {userFirstName || "Guest"}
            </span>
          </div>
          <div className="text-xs tracking-[0.15em] text-[#948880] uppercase font-sans mt-1">
            Your Creative Studio is ready
          </div>
        </>
      )}
    </div>
  );
}