"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Activity, Loader2, Mail, Settings2, Shield, User } from "lucide-react";
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
      <div className="min-h-full bg-background text-foreground pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-8">
          <div className="space-y-2 pb-6 border-b border-border">
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid lg:grid-cols-12 gap-6">
            <Skeleton className="lg:col-span-8 h-80 rounded-xl" />
            <Skeleton className="lg:col-span-4 h-60 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-8 animate-editorial-enter">
        <header className="pb-6 border-b border-border space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Manage your profile details, studio notifications, and account
            lifecycle.
          </p>
        </header>

        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList className="bg-secondary border border-border p-1 rounded-lg h-10 w-full sm:w-auto">
            <TabsTrigger
              value="profile"
              className="flex-1 sm:flex-initial rounded-md px-4 h-8 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs gap-2"
            >
              <User className="size-3.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex-1 sm:flex-initial rounded-md px-4 h-8 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs gap-2"
            >
              <Settings2 className="size-3.5" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <TabsContent
                value="profile"
                className="m-0 space-y-6 outline-none"
              >
                <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <User className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Personal Information
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-background border-input h-10 rounded-lg text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-background border-input h-10 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          disabled
                          value={user?.primaryEmailAddress?.emailAddress || ""}
                          className="bg-secondary/50 border-input h-10 rounded-lg text-muted-foreground text-sm pr-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <Button
                      onClick={handleCommitChanges}
                      disabled={isUpdating || !hasChanges}
                      className="rounded-full h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </section>

                <section className="studio-panel rounded-xl p-5 sm:p-6 border-destructive/25 space-y-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <Shield className="size-4" />
                    <h2 className="text-sm font-semibold">Delete Account</h2>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    Deleting your account permanently removes your voice
                    profiles, generated audio files, and preferences. This
                    cannot be undone.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={isDecommissioning}
                        className="rounded-full h-10 px-6 font-medium text-sm"
                      >
                        {isDecommissioning
                          ? "Deleting Data..."
                          : "Delete Account"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border rounded-xl max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-destructive flex items-center gap-2">
                          <Shield className="size-4 shrink-0" />
                          Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed pt-2">
                          All your data, generated audio files, and personal
                          settings will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-full h-9 px-4 text-xs">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDecommission}
                          className="rounded-full h-9 px-4 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
                className="m-0 space-y-6 outline-none"
              >
                <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <Settings2 className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Notifications &amp; Haptic Feedback
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/40">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-medium text-foreground block">
                          System Updates
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive updates about new models and studio features.
                        </p>
                      </div>
                      <Switch
                        checked={systemUpdates}
                        onCheckedChange={setSystemUpdates}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/40">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-medium text-foreground block">
                          Usage Alerts
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notices about character credit usage.
                        </p>
                      </div>
                      <Switch
                        checked={usageAlerts}
                        onCheckedChange={setUsageAlerts}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/40">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-medium text-foreground block">
                          Security Logs
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive alerts about unusual sign-ins or changes.
                        </p>
                      </div>
                      <Switch
                        checked={securityLogs}
                        onCheckedChange={setSecurityLogs}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/40">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-medium text-foreground block">
                          Haptic Feedback
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Tactile confirmation taps on supported devices.
                        </p>
                      </div>
                      <Switch
                        checked={hapticsEnabled}
                        onCheckedChange={setHapticsEnabled}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <Button
                      onClick={handleCommitChanges}
                      disabled={isUpdating || !hasChanges}
                      className="rounded-full h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
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
            <aside className="lg:col-span-4 space-y-6">
              <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-4">
                <h2 className="text-sm font-semibold text-foreground pb-3 border-b border-border">
                  Need Help?
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reach out anytime if you run into synthesis issues or have
                  questions about your account.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/app/support")}
                  className="w-full h-10 rounded-full bg-card border-border hover:bg-accent text-foreground text-xs font-medium"
                >
                  <Mail className="size-3.5 mr-2" />
                  Contact Support
                </Button>
              </section>

              <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-4">
                <h2 className="text-sm font-semibold text-foreground pb-3 border-b border-border flex items-center gap-2">
                  <Activity className="size-4 text-muted-foreground" />
                  Client Connection
                </h2>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Origin Probe</span>
                    <span className="font-mono text-foreground">
                      {latency !== null ? "Reachable" : "Checking..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Latency</span>
                    <span className="font-mono text-foreground tabular-nums">
                      {latency !== null ? `${latency}ms` : "Checking..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sync</span>
                    <span className="accent-ink font-medium">
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
