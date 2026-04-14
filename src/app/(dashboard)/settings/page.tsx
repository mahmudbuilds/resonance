"use client";

import {
  Settings,
  User,
  CreditCard,
  Key,
  Shield,
  Bell,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function SettingsPage() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background">
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 lg:py-16 mx-auto max-w-[1400px]">
        {/* Header Section */}
        <header className="flex flex-col space-y-4 mb-10">
          <Badge
            variant="outline"
            className="w-fit bg-background/80 dark:bg-background/50 backdrop-blur-md border-primary/30 dark:border-primary/20 text-primary px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.1)]"
          >
            <Settings className="w-3.5 h-3.5 mr-2 text-primary" />
            System Preferences
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-emerald-500">Settings</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Manage your account details, subscriptions, API keys, and notification preferences all in one place.
          </p>
        </header>

        {/* Main Layout */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] bg-card/50 backdrop-blur-md border border-border/50 p-1 h-auto rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 text-sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 text-sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 text-sm">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 text-sm">
              <Bell className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="m-0 space-y-6 animate-in slide-in-from-left-2 duration-500 fade-in pb-12">
                <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 hover:border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                       <User className="w-5 h-5 text-primary" />
                       Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and public profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Alex" className="bg-background/50 border-border/50 h-11 rounded-xl focus-visible:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Mercer" className="bg-background/50 border-border/50 h-11 rounded-xl focus-visible:ring-primary/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="email" type="email" defaultValue="alex@founder.ai" className="pl-10 bg-background/50 border-border/50 h-11 rounded-xl focus-visible:ring-primary/20" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t border-border/50 py-4 flex justify-end">
                    <Button className="rounded-xl px-8 shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:shadow-[0_0_25px_rgba(var(--primary),0.4)] transition-all">Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card className="border border-destructive/20 bg-destructive/5 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-destructive flex items-center gap-2">
                       <Shield className="w-5 h-5" />
                       Danger Zone
                    </CardTitle>
                    <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-muted-foreground mb-4">Once your account is deleted, all of your generated voices, projects, and credits will be permanently destroyed. This action cannot be reversed.</p>
                     <Button variant="destructive" className="rounded-xl">Delete Account</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="m-0 space-y-6 animate-in slide-in-from-left-2 duration-500 fade-in pb-12">
                <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl relative">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Current Plan
                    </CardTitle>
                    <CardDescription>You are currently on the Pro tier.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-background/50 border border-primary/20 rounded-xl shadow-sm gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">Pro Creator Plan</h3>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Unlimited generation, premium voices, and priority support.</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        <p className="text-xs text-muted-foreground mt-1">Renews on Oct 24, 2026</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                         <span className="font-medium text-muted-foreground">Monthly Usage</span>
                         <span className="font-mono">82% <span className="text-muted-foreground/70 text-xs"> (820k / 1M chars)</span></span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[82%] rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t border-border/50 py-4 flex gap-3 z-10 relative">
                    <Button className="rounded-xl shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-shadow hover:shadow-[0_0_25px_rgba(var(--primary),0.4)]">Manage Subscription</Button>
                    <Button variant="outline" className="rounded-xl bg-background/50">View Invoices</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* API Keys Tab */}
              <TabsContent value="api-keys" className="m-0 space-y-6 animate-in slide-in-from-left-2 duration-500 fade-in pb-12">
                 <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 hover:border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                       <Key className="w-5 h-5 text-primary" />
                       API Keys
                    </CardTitle>
                    <CardDescription>Manage keys to authenticate with the developer API.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="pt-2">
                       <div className="flex items-center justify-between p-4 border border-border/50 bg-background/30 rounded-xl">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Production Key</span>
                              <Badge variant="outline" className="text-[10px] uppercase font-mono text-emerald-500 border-emerald-500/30 bg-emerald-500/10">Active</Badge>
                            </div>
                            <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">sk_live_v2...a8f9</code>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-xs rounded-lg hover:text-primary">Reveal</Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg bg-background/50">Revoke</Button>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t border-border/50 py-4">
                    <Button className="rounded-xl shadow-[0_0_15px_rgba(var(--primary),0.2)]">Create new secret key</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="appearance" className="m-0 space-y-6 animate-in slide-in-from-left-2 duration-500 fade-in pb-12">
                 <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 hover:border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                       <Bell className="w-5 h-5 text-primary" />
                       Preferences
                    </CardTitle>
                    <CardDescription>Manage how the application looks and what notifications you receive.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div className="flex items-center justify-between p-4 border border-border/50 bg-background/30 rounded-xl">
                       <div className="space-y-1">
                          <p className="font-medium">Appearance / Theme</p>
                          <p className="text-sm text-muted-foreground">Toggle between light and dark modes.</p>
                       </div>
                       <ModeToggle />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email Notifications</h4>
                      
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <Label className="text-base">Product Updates</Label>
                           <p className="text-sm text-muted-foreground">Receive news about new features and voices.</p>
                         </div>
                         <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <Label className="text-base">Usage Alerts</Label>
                           <p className="text-sm text-muted-foreground">Get notified when you approach your quota limit.</p>
                         </div>
                         <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <Label className="text-base">Promotional Offers</Label>
                           <p className="text-sm text-muted-foreground">Special discounts and early access.</p>
                         </div>
                         <Switch />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>

            </div>

             {/* Support Sidebar Side Widget */}
            <div className="lg:col-span-1 hidden lg:block">
              <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden rounded-2xl sticky top-24 shadow-xl backdrop-blur-xl bg-card/40">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <CardContent className="p-6 flex flex-col pt-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.15)]">
                    <AlertCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Our support team is available 24/7. Reach out if you're experiencing issues with billing, API integrations, or generation quality.</p>
                  
                  <div className="space-y-3">
                     <Button variant="outline" className="w-full justify-start rounded-xl bg-background/50 border-border/50 hover:bg-muted/50 hover:text-primary transition-colors">
                       <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                       Contact Support
                     </Button>
                     <Button variant="outline" className="w-full justify-start rounded-xl bg-background/50 border-border/50 hover:bg-muted/50 hover:text-primary transition-colors">
                       <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                       View Documentation
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </Tabs>
      </div>
    </div>
  );
}