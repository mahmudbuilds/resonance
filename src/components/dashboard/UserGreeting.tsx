"use client"

import { useUser } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";

export default function UserGreeting() {
  const { isLoaded, user } = useUser();
  const userFirstName = user?.firstName;
  return (
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
      {!isLoaded ? (
        <Spinner className="w-8 h-8 md:w-12 md:h-12 text-primary" />
      ) : (
        <span className="block leading-[1.1]">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">
            {userFirstName || "Creator"}
          </span>
          .
          <br />
          <span className="text-muted-foreground/80 dark:text-muted-foreground font-medium">
            What will we build today?
          </span>
        </span>
      )}
    </h1>
  );
}
