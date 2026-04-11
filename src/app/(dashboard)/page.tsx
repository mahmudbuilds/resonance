"use client";

import { useUser } from "@clerk/nextjs";
import { AudioLines, Mic2, Sparkles, Volume2 as Voice } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  const { user } = useUser();

  const userFirstName = user?.firstName;
  const features = [
    {
      title: "Text to Speech",
      description: "Convert text to natural speech",
      icon: AudioLines,
      href: "/text-to-speech",
      color: "bg-blue-500",
    },
    {
      title: "Explore Voices",
      description: "Browse our voice library",
      icon: Voice,
      href: "/voices",
      color: "bg-purple-500",
    },
    {
      title: "Voice Cloning",
      description: "Create your custom voice",
      icon: Mic2,
      href: "/voice-cloning",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-6 space-y-8">
     
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Welcome back, {userFirstName ? userFirstName : <Spinner />}
        </h1>

        <p className="text-muted-foreground">
          What would you like to do today?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get started with AI voice generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">1. Choose a Voice</h4>
              <p className="text-sm text-muted-foreground">
                Browse our library of natural-sounding voices
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/voices">Browse Voices</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">2. Enter Your Text</h4>
              <p className="text-sm text-muted-foreground">
                Type or paste the text you want to convert
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/text-to-speech">Try TTS</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your recent voice generations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity yet. Start generating voice to see your history
              here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
