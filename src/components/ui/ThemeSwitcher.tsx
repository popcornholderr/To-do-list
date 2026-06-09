"use client";

import { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "@/src/components/ui/providers/ThemeProvider";

export function ThemeSwitcher() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { resolvedTheme, setTheme } = ctx;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-[5px] transition-opacity hover:opacity-60 focus-ring"
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: "2px",
        color: "var(--text-3)",
      }}
      aria-label="Toggle theme"
    >
      {isDark
        ? <Sun size={11} strokeWidth={1.75} />
        : <Moon size={11} strokeWidth={1.75} />
      }
      <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}