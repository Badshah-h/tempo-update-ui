import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Settings,
  MessageSquare,
  Code,
  FileText,
  LayoutDashboard,
  Moon,
  Sun,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ThemeSwitcher from "./ThemeSwitcher";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({
  icon,
  label,
  href,
  isActive,
  isCollapsed,
  onClick,
}: NavItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all relative overflow-hidden group",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center transition-all",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "transition-all duration-200",
          isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100",
        )}
      >
        {label}
      </span>
      {isActive && (
        <>
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/80 rounded-r-md shadow-sm" />
          <span
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-tr-md shadow-sm"
            style={{ width: isCollapsed ? "100%" : "70%" }}
          />
        </>
      )}
    </Link>
  );
};

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Widget Config",
      href: "/admin/widget",
    },
    {
      icon: <Code className="h-5 w-5" />,
      label: "AI Models",
      href: "/admin/models",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Prompt Templates",
      href: "/admin/prompts",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Analytics",
      href: "/admin/analytics",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col border-r bg-background/95 backdrop-blur-sm shadow-soft",
          isCollapsed ? "w-[70px]" : "w-[240px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        animate={{
          width: isCollapsed ? 70 : 240,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(var(--primary), 0.04) 2%, transparent 0%),
                           radial-gradient(circle at 75px 75px, rgba(var(--primary), 0.04) 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md shadow-sm border border-primary/5">
              <MessageSquare className="h-6 w-6 text-primary drop-shadow-sm" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent drop-shadow-sm"
              >
                AI Admin
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isCollapsed && <ThemeSwitcher />}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCollapsed ? "rotate-0" : "rotate-180",
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2 px-3">
          <nav className="grid gap-1">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-primary/5"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 hover:bg-primary/5"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20 ring-2 ring-background">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">Admin User</span>
                      <span className="text-xs text-muted-foreground">
                        Administrator
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">
                        admin@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5">
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/")}
                    className="cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isCollapsed ? "lg:pl-[70px]" : "lg:pl-[240px]",
        )}
      >
        {/* Top navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur-sm px-6">
          {/* Sidebar toggle for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Optional: Page title or breadcrumbs here */}
          {/* <div className="ml-4 font-semibold text-lg">Dashboard</div> */}

          <div className="ml-auto flex items-center gap-3">
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-rose-500"></span>
            </Button>

            {/* View Website */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => navigate("/")}
            >
              <MessageSquare className="h-4 w-4" />
              View Website
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 hover:bg-primary/5"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/20 ring-2 ring-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium">
                    Admin User
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">
                      admin@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5">
                  <Settings className="mr-2 h-4 w-4 text-primary" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/")}
                  className="cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-auto w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 100px 100px, rgba(var(--primary), 0.01) 2%, transparent 0%),
                             radial-gradient(circle at 200px 200px, rgba(var(--secondary), 0.01) 2%, transparent 0%)`,
            backgroundSize: "300px 300px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
