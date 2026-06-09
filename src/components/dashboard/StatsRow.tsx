"use client";

import { motion } from "framer-motion";
import { useAnalytics } from "@/src/hooks/useAnalytics";
import { useTaskStore } from "@/src/store/taskStore";

interface StatBlockProps {
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
  invert?: boolean;
  theme: string;
}

function StatBlock({ label, value, sub, delay = 0, invert = false, theme }: StatBlockProps) {
  const isDark = theme === "dark" || theme === "midnight";

  // Invert block: in light mode → dark bg (ink). In dark mode → warm off-white.
  const invertBg    = isDark ? "var(--text-1)" : "var(--ink)";
  const invertText  = isDark ? "var(--bg-0)"   : "#fff";
  const invertSub   = isDark ? "rgba(16,14,10,0.45)" : "rgba(255,255,255,0.38)";
  const invertLabel = isDark ? "rgba(16,14,10,0.5)"  : "rgba(255,255,255,0.42)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: invert ? invertBg : "var(--bg-1)",
        border: `1px solid ${invert ? "transparent" : "var(--border)"}`,
        borderRadius: "12px",
        padding: "24px 24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <p style={{
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: invert ? invertLabel : "var(--text-4)",
        fontFamily: "var(--font-body)",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: "42px",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: invert ? invertText : "var(--text-1)",
      }}>
        {value}
      </p>
      {sub && (
        <p style={{
          fontSize: "12px",
          color: invert ? invertSub : "var(--text-4)",
          fontFamily: "var(--font-body)",
          letterSpacing: "0.01em",
        }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

export function StatsRow() {
  const { total, completed, pending, completionRate, streak } = useAnalytics();
  const activeTheme = useTaskStore((s) => s.activeTheme);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
      <StatBlock label="Total"   value={total}                sub="tasks"               delay={0}    theme={activeTheme} />
      <StatBlock label="Done"    value={completed}            sub="completed"            delay={0.06} invert theme={activeTheme} />
      <StatBlock label="Pending" value={pending}              sub="remaining"            delay={0.1}  theme={activeTheme} />
      <StatBlock label="Rate"    value={`${completionRate}%`} sub={`${streak}d streak`}  delay={0.14} theme={activeTheme} />
    </div>
  );
}