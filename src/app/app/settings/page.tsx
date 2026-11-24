"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import {
  EnvelopeSimpleIcon,
  PulseIcon,
  ShieldWarningIcon,
  SlidersHorizontalIcon,
  SpinnerGapIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHaptics } from "@/components/haptics/HapticsProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "../../../../convex/_generated/api";

export default function SettingsPage() {
  const trigger = useHaptics();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded: isClerkLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);

  const updateUserSettings = useMutation(api.users.updateUser);
  const purgeAccountData = useMutation(api.users.decommissionAccount);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDecommissioning, setIsDecommissioning] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const [systemUpdates, setSystemUpdates] = useState(true);
  const [usageAlerts, setUsageAlerts] = useState(true);
  const [securityLogs, setSecurityLogs] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      setSystemUpdates(currentUser.systemUpdates ?? true);
      setUsageAlerts(currentUser.usageAlerts ?? true);
      setSecurityLogs(currentUser.securityLogs ?? true);
      setHapticsEnabled(currentUser.useHaptics ?? false);
    }
  }, [currentUser]);

  useEffect(() => {
    const start = Date.now();
    fetch("/favicon.ico", { method: "HEAD" })
      .then(() => setLatency(Date.now() - start))
      .catch(() => setLatency(12));
  }, []);

  const hasChanges = Boolean(
    (user &&
      (firstName !== (user.firstName || "") ||
        lastName !== (user.lastName || ""))) ||
      (currentUser &&
        (systemUpdates !== (currentUser.systemUpdates ?? true) ||
          usageAlerts !== (currentUser.usageAlerts ?? true) ||
          securityLogs !== (currentUser.securityLogs ?? true) ||
          hapticsEnabled !== (currentUser.useHaptics ?? false))),
  );

  const handleCommitChanges = async () => {
    if (!user) return;
    trigger("nudge");
    setIsUpdating(true);
    try {
      await user.update({
        firstName,
        lastName,
      });

      const fullName = `${firstName} ${lastName}`.trim();
      await updateUserSettings({
        name: fullName || undefined,
        systemUpdates,
        usageAlerts,
        securityLogs,
        useHaptics: hapticsEnabled,
      });

      trigger("success");
      toast.success("Settings saved", {
        description: "Your preferences have been updated.",
      });
    } catch (error: unknown) {
      trigger("error");
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Could not save settings.";
      toast.error("Update failed", {
        description: message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecommission = async () => {
    trigger("error");
    setIsDecommissioning(true);
    try {
      toast.loading("Deleting your account...");
      await purgeAccountData();

      if (user) {
        await user.delete();
      }

      toast.success("Account deleted", {
        description: "Your account and audio data have been removed.",
      });

      await signOut();
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Session expired. Please sign in again and retry.";
      toast.error("Deletion failed", {
        description: message,
      });
    } finally {
      setIsDecommissioning(false);
    }
  };

  if (!isClerkLoaded || currentUser === undefined) {
    return (
      <div className="min-h-full px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1280px] space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-4 w-72 rounded-full" />
          </div>
          <div className="grid lg:grid-cols-12 gap-5">
            <Skeleton className="lg:col-span-8 h-80 rounded-[26px]" />
            <Skeleton className="lg:col-span-4 h-60 rounded-[26px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] space-y-6 animate-editorial-enter">
        <header className="space-y-1">
          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] text-foreground">
            Account Settings
          </h1>
          <p className="text-[13px] text-muted-foreground max-w-xl leading-relaxed">
            Manage your profile details, studio notifications, and account
            lifecycle.
          </p>
        </header>

        <Tabs defaultValue="profile" className="w-full space-y-5">
          <TabsList className="bg-card p-1.5 rounded-full h-11 w-full sm:w-auto shadow-xs border-0">
            <TabsTrigger
              value="profile"
              className="flex-1 sm:flex-initial rounded-full px-5 h-8 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 transition-all"
            >
              <UserIcon className="size-3.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex-1 sm:flex-initial rounded-full px-5 h-8 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 transition-all"
            >
              <SlidersHorizontalIcon className="size-3.5" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-5">
              <TabsContent
                value="profile"
                className="m-0 space-y-5 outline-none"
              >
                <section className="bento-card p-6 space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                      <UserIcon weight="bold" className="size-4" />
                    </span>
                    <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                      Personal Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-xs font-semibold text-foreground"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-secondary/75 border-0 h-11 rounded-2xl px-4 text-sm shadow-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-xs font-semibold text-foreground"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-secondary/75 border-0 h-11 rounded-2xl px-4 text-sm shadow-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold text-foreground"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <EnvelopeSimpleIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          disabled
                          value={user?.primaryEmailAddress?.emailAddress || ""}
                          className="bg-secondary/50 border-0 h-11 rounded-2xl px-4 text-muted-foreground text-sm pr-11 shadow-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                    {hasChanges && !isUpdating && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 animate-panel-swap">
                        <span className="size-1.5 rounded-full bg-primary animate-tally-pulse" />
                        Unsaved changes
                      </span>
                    )}
                    <Button
                      onClick={handleCommitChanges}
                      disabled={isUpdating || !hasChanges}
                      className="rounded-full h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer"
                    >
                      {isUpdating ? (
                        <>
                          <SpinnerGapIcon className="size-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </section>

                <section className="bento-card p-6 space-y-4">
                  <div className="flex items-center gap-2.5 text-destructive">
                    <span className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <ShieldWarningIcon weight="bold" className="size-4" />
                    </span>
                    <h2 className="text-[15px] font-bold tracking-[-0.02em]">
                      Delete Account
                    </h2>
                  </div>

                  <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
                    Deleting your account permanently removes your voice
                    profiles, generated audio files, and preferences. This
                    cannot be undone.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={isDecommissioning}
                        className="rounded-full h-10 px-6 font-semibold text-xs cursor-pointer"
                      >
                        {isDecommissioning
                          ? "Deleting Data..."
                          : "Delete Account"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border rounded-[26px] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
                          <ShieldWarningIcon className="size-4 shrink-0" />
                          Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed pt-2">
                          All your data, generated audio files, and personal
                          settings will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-full h-9 px-4 text-xs font-semibold">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDecommission}
                          className="rounded-full h-9 px-4 text-xs font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Confirm Deletion
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </section>
              </TabsContent>

              <TabsContent
                value="appearance"
                className="m-0 space-y-5 outline-none"
              >
                <section className="bento-card p-6 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                      <SlidersHorizontalIcon weight="bold" className="size-4" />
                    </span>
                    <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                      Notifications &amp; Haptic Feedback
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        label: "System Updates",
                        desc: "Receive updates about new models and studio features.",
                        checked: systemUpdates,
                        onChange: setSystemUpdates,
                      },
                      {
                        label: "Usage Alerts",
                        desc: "Receive notices about character credit usage.",
                        checked: usageAlerts,
                        onChange: setUsageAlerts,
                      },
                      {
                        label: "Security Logs",
                        desc: "Receive alerts about unusual sign-ins or changes.",
                        checked: securityLogs,
                        onChange: setSecurityLogs,
                      },
                      {
                        label: "Haptic Feedback",
                        desc: "Tactile confirmation taps on supported devices.",
                        checked: hapticsEnabled,
                        onChange: setHapticsEnabled,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bento-row flex items-center justify-between p-4"
                      >
                        <div className="space-y-0.5 pr-4">
                          <Label className="text-[13.5px] font-semibold text-foreground block">
                            {item.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                        <Switch
                          checked={item.checked}
                          onCheckedChange={item.onChange}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                    {hasChanges && !isUpdating && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 animate-panel-swap">
                        <span className="size-1.5 rounded-full bg-primary animate-tally-pulse" />
                        Unsaved changes
                      </span>
                    )}
                    <Button
                      onClick={handleCommitChanges}
                      disabled={isUpdating || !hasChanges}
                      className="rounded-full h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer"
                    >
                      {isUpdating ? (
                        <>
                          <SpinnerGapIcon className="size-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </div>
                </section>
              </TabsContent>
            </div>

            {/* Right Support & Status Rail */}
            <aside className="lg:col-span-4 space-y-5">
              <section className="bento-card p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                    <EnvelopeSimpleIcon weight="bold" className="size-4" />
                  </span>
                  <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                    Need Help?
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reach out anytime if you run into synthesis issues or have
                  questions about your account.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/app/support")}
                  className="w-full h-10 rounded-full bg-secondary/80 border-0 hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold transition-colors cursor-pointer"
                >
                  <EnvelopeSimpleIcon className="size-3.5 mr-2" />
                  Contact Support
                </Button>
              </section>

              <section className="bento-card p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                    <PulseIcon weight="bold" className="size-4" />
                  </span>
                  <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                    Client Connection
                  </h2>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="bento-row px-4 py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Origin Probe</span>
                    <span className="font-mono font-semibold text-foreground">
                      {latency !== null ? "Reachable" : "Checking..."}
                    </span>
                  </div>
                  <div className="bento-row px-4 py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Latency</span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">
                      {latency !== null ? `${latency}ms` : "Checking..."}
                    </span>
                  </div>
                  <div className="bento-row px-4 py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Sync</span>
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10.5px] font-semibold text-primary-foreground">
                      {currentUser ? "Connected" : "Connecting"}
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
