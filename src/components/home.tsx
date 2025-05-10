import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  LogIn,
  MessageSquare,
  Settings,
  UserPlus,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ThemeSwitcher from "./ThemeSwitcher";
import ChatWidget from "./chat/ChatWidget";
import EmbedCodeGenerator from "./EmbedCodeGenerator";

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm shadow-soft">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10 border border-primary/5 shadow-sm">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AI Chat System
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#demo"
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Demo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#embed"
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Embed
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Auth & Theme Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-primary/5 transition-colors duration-300"
                onClick={goToLogin}
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
                onClick={goToRegister}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Register
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeSwitcher />
              <Button
                variant="default"
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
                onClick={goToLogin}
              >
                <LogIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 space-y-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-70" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            className="inline-block mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20">
              Powerful AI Chat Solution
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Intelligent Conversations,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Anywhere
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Embed our AI-powered chat widget on your website and provide
            instant, context-aware responses to your visitors.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="gap-2 shadow-medium hover:shadow-hard transition-shadow duration-300 bg-gradient-subtle from-primary to-primary/90 hover:from-primary hover:to-primary/80"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/30 transition-colors duration-300"
            >
              <Code className="h-4 w-4" />
              View Documentation
            </Button>
            {/* TEMPORARY: Admin access button for development purposes */}
            <Button
              size="lg"
              variant="default"
              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-medium hover:shadow-hard transition-all duration-300"
              onClick={() => navigate("/admin")}
            >
              <Settings className="h-4 w-4" />
              Admin Dashboard
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
          {features.map((feature, index) => {
            const CardComponent = feature.link
              ? (props: React.ComponentProps<typeof Card>) => (
                  <Card
                    {...props}
                    onClick={() => navigate(feature.link!)}
                    className={`${props.className} cursor-pointer`}
                  />
                )
              : Card;

            return (
              <CardComponent
                key={index}
                className="bg-card border border-border/60 hover:border-primary/20 transition-colors duration-300 shadow-soft hover:shadow-medium group overflow-hidden"
              >
                <CardHeader>
                  <div className="p-2.5 w-fit rounded-md bg-primary/10 border border-primary/5 shadow-sm group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="group-hover:text-muted-foreground/90 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </CardComponent>
            );
          })}
        </div>
      </section>

      {/* Demo Section */}
      <section
        id="demo"
        className="container py-24 space-y-16 bg-gradient-subtle from-muted/30 to-muted/60 rounded-xl p-8 border border-border/60 shadow-soft"
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
          <div className="w-full max-w-md p-6 bg-card rounded-xl border border-border/60 shadow-medium">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
              </span>
              Chat Demo
            </h3>
            <p className="text-muted-foreground mb-6">
              This is the same widget that will be embedded on your website. Try
              it out!
            </p>
            <div className="h-[400px] border rounded-lg overflow-hidden shadow-inner-soft">
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
                <div className="flex items-start gap-3 group">
                  <div className="p-1.5 rounded-full bg-primary/10 border border-primary/5 shadow-sm group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                      Context-Aware Responses
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-300">
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
      <section id="embed" className="container py-24 space-y-16 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/30 to-transparent opacity-50" />

        <div className="text-center space-y-4 relative z-10">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20 mb-4">
            Simple Integration
          </span>
          <h2 className="text-3xl font-bold tracking-tight">Ready to Embed?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get the code snippet to add our AI chat widget to your website in
            seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <EmbedCodeGenerator />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10 border border-primary/5">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AI Chat System
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Chat System. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
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

// Define the Feature interface
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

const features: Feature[] = [
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
    link: "/login",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    title: "Multiple AI Models",
    description:
      "Leverage the power of Gemini and Hugging Face AI models for intelligent, human-like conversations.",
  },
];

export default Home;
