"use client"

import { useUser } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";

export default function UserGreeting() {
  const { isLoaded, user } = useUser();
  const userFirstName = user?.firstName;
  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
      {!isLoaded ? (
        <Spinner className="w-8 h-8 md:w-12 md:h-12 text-primary" />
      ) : (
        <span className="block leading-[1.15]">
          Welcome back,{" "}
          <span className="whitespace-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">
              {userFirstName || "Creator"}
            </span>
            <span className="text-foreground">.</span>
          </span>
          <br />
          <span className="text-muted-foreground/80 dark:text-muted-foreground font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 block">
            What will we build today?
          </span>
        </span>
      )}
    </h1>
  );
}
