"use client";

import { useQuery } from "convex/react";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { HapticInput } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";
import { api } from "../../../convex/_generated/api";

type Trigger = (input: HapticInput) => void;

const HapticsContext = createContext<Trigger | null>(null);

export function HapticsProvider({ children }: { children: ReactNode }) {
  const { trigger } = useWebHaptics();
  const currentUser = useQuery(api.users.getCurrentUser);
  const enabled = currentUser?.useHaptics === true;

  const value = useMemo<Trigger>(
    () => (input) => {
      if (!enabled) return;
      void trigger(input);
    },
    [enabled, trigger],
  );

  return (
    <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>
  );
}

export function useHaptics(): Trigger {
  const ctx = useContext(HapticsContext);
  return ctx ?? (() => {});
}
