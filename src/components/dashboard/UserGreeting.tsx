"use client";

import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserGreeting() {
  const { isLoaded, user } = useUser();
  const userFirstName = user?.firstName;

  if (!isLoaded) {
    return <Skeleton className="h-10 w-64 rounded-lg bg-secondary" />;
  }

  return (
    <span>
      Welcome back,{" "}
      <span className="accent-ink font-semibold">
        {userFirstName || "Creator"}
      </span>
    </span>
  );
}
