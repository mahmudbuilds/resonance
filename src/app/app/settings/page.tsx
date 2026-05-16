"use client";

import {
  AlertTriangle,
  Bell,
  Mail,
  Settings,
  Shield,
  User,
  Terminal,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white selection:bg-primary selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 responsive-container">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16 border-b border-[#222] pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs uppercase text-primary">
              <Settings className="w-3 h-3" />
              Module: System Preferences
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              ACCOUNT <span className="text-primary">SETTINGS</span>
            </h1>
          </div>
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
            Configure neural parameters and account authorization levels. 
            Maintain system integrity through precise calibration.
          </p>
        </header>

        {/* Main Layout */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-transparent p-0 rounded-none h-12 sm:h-14 w-full max-w-full sm:max-w-md flex border border-[#333] mb-8 sm:mb-12 overflow-hidden">
            <TabsTrigger
              value="profile"
              className="flex-1 rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest text-[10px] sm:text-xs h-full gap-2"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">Identification</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex-1 rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest text-[10px] sm:text-xs h-full gap-2"
            >
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">Protocols</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12">
            <div className="lg:col-span-8 space-y-8 sm:space-y-12">
              {/* Profile Tab */}
              <TabsContent
                value="profile"
                className="m-0 space-y-8 sm:space-y-12 outline-none"
              >
                <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative">
                  <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary">
                    Identity_Registry
                  </div>
                  
                  <div className="space-y-6 sm:space-y-8 mt-4">
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]">
                          Given_Name
                        </Label>
                        <Input
                          id="firstName"
                          defaultValue="ALEX"
                          className="bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono uppercase placeholder:text-[#444] text-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]">
                          Family_Name
                        </Label>
                        <Input
                          id="lastName"
                          defaultValue="MERCER"
                          className="bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono uppercase placeholder:text-[#444] text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]">
                        Network_Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue="ALEX@FOUNDER.AI"
                          className="pl-12 bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono uppercase placeholder:text-[#444] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 sm:mt-12 pt-8 border-t border-[#222] flex justify-end">
                    <Button className="h-12 sm:h-14 w-full sm:w-auto px-10 rounded-none bg-primary hover:bg-white text-black font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors border border-primary">
                      Commit Changes
                    </Button>
                  </div>
                </div>

                <div className="border border-red-900/50 bg-[#050505] p-6 sm:p-8 relative">
                  <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-red-600">
                    Terminal_Directive
                  </div>
                  
                  <div className="flex items-center gap-4 text-red-500 mb-6">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    <h3 className="font-heading text-lg sm:text-xl font-bold uppercase">Decommission Account</h3>
                  </div>
                  
                  <p className="font-mono text-[10px] sm:text-xs text-[#888] uppercase leading-relaxed mb-8 max-w-2xl">
                    Once the decommissioning sequence is initiated, all neural maps, 
                    voice assets, and credit reserves will be purged from the mainframe. 
                    This operation is irreversible.
                  </p>
                  
                  <Button variant="destructive" className="h-12 sm:h-14 w-full sm:w-auto px-8 rounded-none border border-red-600 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-600 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors">
                    Execute Deletion Protocol
                  </Button>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent
                value="appearance"
                className="m-0 space-y-8 sm:space-y-12 outline-none"
              >
                <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative">
                  <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary">
                    Protocol_Configs
                  </div>

                  <div className="space-y-8 sm:space-y-12 mt-8">
                    <div className="space-y-4 sm:space-y-6">
                      <h4 className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-primary border-b border-[#222] pb-4">
                        Communication_Streams
                      </h4>

                      <div className="flex items-center justify-between p-5 sm:p-6 bg-[#111] border border-[#333]">
                        <div className="space-y-1 min-w-0 pr-4">
                          <Label className="font-mono text-xs sm:text-sm uppercase tracking-wider text-white block truncate">System Updates</Label>
                          <p className="font-mono text-[9px] sm:text-[10px] text-[#666] uppercase">New features and neural models.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-primary shrink-0" />
                      </div>

                      <div className="flex items-center justify-between p-5 sm:p-6 bg-[#111] border border-[#333]">
                        <div className="space-y-1 min-w-0 pr-4">
                          <Label className="font-mono text-xs sm:text-sm uppercase tracking-wider text-white block truncate">Usage Alerts</Label>
                          <p className="font-mono text-[9px] sm:text-[10px] text-[#666] uppercase">Quota and throughput notifications.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-primary shrink-0" />
                      </div>

                      <div className="flex items-center justify-between p-5 sm:p-6 bg-[#111] border border-[#333]">
                        <div className="space-y-1 min-w-0 pr-4">
                          <Label className="font-mono text-xs sm:text-sm uppercase tracking-wider text-white block truncate">Security Logs</Label>
                          <p className="font-mono text-[9px] sm:text-[10px] text-[#666] uppercase">Critical account access reports.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-primary shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Sidebar Support */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#111] border-b border-l border-[#333] font-mono text-[8px] text-[#555] uppercase">
                  Ref: SUP_001
                </div>
                
                <h3 className="font-heading text-lg font-bold uppercase text-primary mb-6 flex items-center gap-3 border-b border-[#222] pb-4">
                  <AlertTriangle className="w-5 h-5" /> Technical Assistance
                </h3>
                
                <p className="font-mono text-[10px] sm:text-xs text-[#aaa] uppercase leading-relaxed mb-8">
                  Core support units are active 24/7. Address billing anomalies 
                  or API synchronization failures through secure channels.
                </p>

                <Button
                  variant="outline"
                  className="w-full h-12 sm:h-14 rounded-none border-[#333] bg-[#111] hover:bg-primary hover:text-black hover:border-primary transition-all font-mono text-[10px] sm:text-xs uppercase tracking-widest"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-3 shrink-0" /> Initialize Contact
                </Button>
              </div>

              <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 opacity-40">
                <h3 className="font-mono text-xs sm:text-sm uppercase text-[#888] mb-6 flex items-center gap-3 border-b border-[#222] pb-4">
                  <Terminal className="w-4 h-4" /> System_Logs
                </h3>
                <div className="space-y-3 font-mono text-[9px] sm:text-[10px] text-[#555] uppercase">
                  <div className="flex justify-between">
                    <span>UPTIME</span>
                    <span className="text-[#333]">99.98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LATENCY</span>
                    <span className="text-[#333]">24MS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATUS</span>
                    <span className="text-primary/60">NOMINAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
