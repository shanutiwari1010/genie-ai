"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Zap, Shield, Users, Brain, Globe } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function AuthPage() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description:
        "Powered by cutting-edge language models for intelligent conversations",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant responses with optimized performance and minimal latency",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your conversations are encrypted and secure with enterprise-grade protection",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share conversations and collaborate with your team members seamlessly",
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description:
        "Engage in human-like dialogues with context-aware responses",
    },
    {
      icon: Globe,
      title: "Multi-language",
      description:
        "Communicate in multiple languages with real-time translation",
    },
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-medium">GenieAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/chat">
                <Button variant="outline">Sign In</Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The Future of AI Conversations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience next-generation AI chat that understands context, learns
            from your preferences, and delivers intelligent responses that feel
            truly human.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Chatting Free
              </Button>
            </SignUpButton>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose GenieAI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful features that make our AI chat platform the
              preferred choice for individuals and teams worldwide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/50 hover:border-border transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl mb-6">
            Ready to Transform Your Conversations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join over 10,000+ users who are already experiencing the future of
            AI communication.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Today
            </Button>
          </SignUpButton>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 GenieAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
