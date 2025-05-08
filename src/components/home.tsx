import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, MessageSquare, Settings, Zap } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ChatWidget from "./chat/ChatWidget";
import EmbedCodeGenerator from "./EmbedCodeGenerator";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Chat System</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Demo
            </a>
            <a
              href="#embed"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Embed
            </a>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          </nav>
          <Button className="md:hidden" variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Intelligent Conversations,{" "}
            <span className="text-primary">Anywhere</span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Embed our AI-powered chat widget on your website and provide
            instant, context-aware responses to your visitors.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Code className="h-4 w-4" />
              View Documentation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI chat system comes with everything you need to provide
            intelligent, context-aware responses to your website visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card">
              <CardHeader>
                <div className="p-2 w-fit rounded-md bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section
        id="demo"
        className="container py-24 space-y-16 bg-muted/40 rounded-xl p-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            See It In Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Try out our AI chat widget right here. Ask questions and see how it
            responds with context-aware answers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="w-full max-w-md p-6 bg-card rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Chat Demo</h3>
            <p className="text-muted-foreground mb-6">
              This is the same widget that will be embedded on your website. Try
              it out!
            </p>
            <div className="h-[400px] border rounded-lg overflow-hidden">
              <ChatWidget />
            </div>
          </div>

          <div className="w-full max-w-md space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>
                  What makes our chat widget special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      Context-Aware Responses
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The AI understands the context of your business and
                      provides relevant answers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      Real-Time Communication
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Instant responses via WebSocket technology for a smooth
                      user experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Advanced AI Models</h4>
                    <p className="text-sm text-muted-foreground">
                      Powered by Gemini and Hugging Face for intelligent,
                      human-like conversations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Embed Section */}
      <section id="embed" className="container py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Embed?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get the code snippet to add our AI chat widget to your website in
            seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <EmbedCodeGenerator />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Chat System</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Chat System. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Chat Widget (Fixed Position) */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatWidget />
      </div>
    </div>
  );
};

const features = [
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    title: "Context-Aware AI",
    description:
      "Our AI understands the context of your business and provides relevant, accurate responses to user queries.",
  },
  {
    icon: <Code className="h-5 w-5 text-primary" />,
    title: "Easy Integration",
    description:
      "Embed our chat widget on your website with a simple code snippet. No technical knowledge required.",
  },
  {
    icon: <Settings className="h-5 w-5 text-primary" />,
    title: "Customizable",
    description:
      "Customize the appearance and behavior of the chat widget to match your brand and requirements.",
  },
  {
    icon: <Zap className="h-5 w-5 text-primary" />,
    title: "Real-Time Communication",
    description:
      "Instant responses via WebSocket technology for a smooth and responsive user experience.",
  },
  {
    icon: <Settings className="h-5 w-5 text-primary" />,
    title: "Advanced Admin Panel",
    description:
      "Manage your chat system with our comprehensive admin panel. Configure AI models, prompts, and more.",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    title: "Multiple AI Models",
    description:
      "Leverage the power of Gemini and Hugging Face AI models for intelligent, human-like conversations.",
  },
];

export default Home;
