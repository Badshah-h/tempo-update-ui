import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Laptop, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ThemeSwitcherProps {
  onThemeChange?: (theme: string, accent: string) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [accent, setAccent] = useState<string>("gold");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme");
    const storedAccent = localStorage.getItem("accent");

    if (storedTheme) {
      setTheme(storedTheme as "light" | "dark" | "system");
    }

    if (storedAccent) {
      setAccent(storedAccent);
    }

    // Apply theme based on system preference if set to system
    if (storedTheme === "system" || !storedTheme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }

    if (onThemeChange) {
      onThemeChange(newTheme, accent);
    }
  };

  const handleAccentChange = (newAccent: string) => {
    setAccent(newAccent);
    localStorage.setItem("accent", newAccent);

    // Apply accent color
    document.documentElement.style.setProperty(
      "--accent-color",
      getAccentColor(newAccent),
    );

    if (onThemeChange) {
      onThemeChange(theme, newAccent);
    }
  };

  const getAccentColor = (accentName: string) => {
    const accentColors = {
      gold: "#E6A817",
      blue: "#3B82F6",
      green: "#10B981",
      purple: "#8B5CF6",
      pink: "#EC4899",
      red: "#EF4444",
    };
    return (
      accentColors[accentName as keyof typeof accentColors] || accentColors.gold
    );
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
        return <Laptop className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-primary/5"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Palette className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Appearance</h4>
            <div className="flex gap-2">
              {["light", "dark", "system"].map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${theme === t ? "border-primary bg-primary/5" : ""}`}
                  onClick={() =>
                    handleThemeChange(t as "light" | "dark" | "system")
                  }
                >
                  {t === "light" && <Sun className="h-4 w-4 mr-1" />}
                  {t === "dark" && <Moon className="h-4 w-4 mr-1" />}
                  {t === "system" && <Laptop className="h-4 w-4 mr-1" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {theme === t && <Check className="h-3 w-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Accent Color</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "gold", color: "#E6A817" },
                { name: "blue", color: "#3B82F6" },
                { name: "green", color: "#10B981" },
                { name: "purple", color: "#8B5CF6" },
                { name: "pink", color: "#EC4899" },
                { name: "red", color: "#EF4444" },
              ].map((a) => (
                <Button
                  key={a.name}
                  variant="outline"
                  size="sm"
                  className={`flex items-center justify-center gap-1 ${accent === a.name ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => handleAccentChange(a.name)}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                  <span className="capitalize text-xs">{a.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSwitcher;
