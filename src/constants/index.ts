import type { Category, Priority, Theme } from "@/src/types";

export const CATEGORIES: Record<
  Category,
  { color: string; icon: string; bg: string; border: string; label: string }
> = {
  Personal: {
    color: "#a78bfa",
    icon: "🧩",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    label: "Personal",
  },
  Work: {
    color: "#60a5fa",
    icon: "💼",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
    label: "Work",
  },
  Study: {
    color: "#34d399",
    icon: "📖",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    label: "Study",
  },
  Health: {
    color: "#f472b6",
    icon: "💪",
    bg: "rgba(244,114,182,0.1)",
    border: "rgba(244,114,182,0.2)",
    label: "Health",
  },
  Finance: {
    color: "#fbbf24",
    icon: "💰",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    label: "Finance",
  },
};

export const PRIORITIES: Record<
  Priority,
  { label: string; color: string; bg: string; border: string; barColor: string }
> = {
  low: {
    label: "Low",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    barColor: "#34d399",
  },
  medium: {
    label: "Medium",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    barColor: "#fbbf24",
  },
  high: {
    label: "High",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.2)",
    barColor: "#f97316",
  },
  critical: {
    label: "Critical",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
    barColor: "#f87171",
  },
};

export const THEMES: Record<
  Theme,
  { label: string; icon: string; description: string }
> = {
  midnight: {
    label: "Midnight",
    icon: "🌙",
    description: "Premium dark experience",
  },
  aurora: {
    label: "Aurora",
    icon: "🌌",
    description: "Gradient-based futuristic",
  },
  light: {
    label: "Light",
    icon: "☀️",
    description: "Clean professional",
  },
  glass: {
    label: "Glass",
    icon: "💎",
    description: "Luxury glassmorphism",
  },
};

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const STORAGE_KEY = "apex_tasks_v3";
export const STORAGE_THEME_KEY = "apex_theme_v1";

export const SEED_TASKS = [
  {
    title: "Launch new product landing page",
    description:
      "Finalize hero section copy and review A/B test results before deploy",
    priority: "high" as Priority,
    category: "Work" as Category,
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    tags: ["Design", "Launch"],
  },
  {
    title: "Review Q3 financial projections",
    description:
      "Cross-check with CFO spreadsheet and update revenue forecasts",
    priority: "critical" as Priority,
    category: "Finance" as Category,
    dueDate: new Date().toISOString().split("T")[0],
    tags: ["Finance", "Q3"],
  },
  {
    title: "Morning run — 5km",
    description: "Track pace and HR. Target under 28 minutes.",
    priority: "medium" as Priority,
    category: "Health" as Category,
    dueDate: new Date().toISOString().split("T")[0],
    tags: ["Exercise"],
  },
  {
    title: 'Read "Thinking Fast and Slow"',
    description:
      "Finish chapters 14–18, take notes on cognitive bias section",
    priority: "low" as Priority,
    category: "Study" as Category,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    tags: ["Books", "Learning"],
  },
  {
    title: "Fix authentication bug in dashboard",
    description: "Token refresh issue causing logged-out state on mobile Safari",
    priority: "critical" as Priority,
    category: "Work" as Category,
    dueDate: new Date().toISOString().split("T")[0],
    tags: ["Bug", "Auth"],
  },
  {
    title: "Weekly grocery shopping",
    description: "Restock fruits, proteins, and oat milk",
    priority: "low" as Priority,
    category: "Personal" as Category,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    tags: ["Errands"],
  },
  {
    title: "Meditate for 20 minutes",
    description: "Use Headspace — calm session",
    priority: "low" as Priority,
    category: "Health" as Category,
    dueDate: new Date().toISOString().split("T")[0],
    tags: ["Mindfulness"],
  },
  {
    title: "Update portfolio with new projects",
    description: "Add case studies for Apex and Lumen projects",
    priority: "medium" as Priority,
    category: "Personal" as Category,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    tags: ["Portfolio", "Design"],
  },
];