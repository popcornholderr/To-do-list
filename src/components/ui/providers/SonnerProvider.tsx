"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/src/components/ui/providers/ThemeProvider";

export function SonnerProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme}
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--bg-2)",
          border: "1px solid var(--border-2)",
          color: "var(--text-1)",
          borderRadius: "12px",
          fontSize: "13px",
          fontFamily: "inherit",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        },
      }}
    />
  );
}