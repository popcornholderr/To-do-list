"use client";

import { useTaskStore } from "@/src/store/taskStore";
import type { Priority } from "@/src/types";
import { PRIORITIES } from "@/src/constants";

export function FilterBar() {
  const { activePriority, setActivePriority } = useTaskStore();

  const items: (Priority | "all")[] = ["all", "low", "medium", "high", "critical"];
  const emojis: Record<string, string> = {
    all: "⊞",
    low: "🟢",
    medium: "🟡",
    high: "🟠",
    critical: "🔴",
  };

  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {items.map((p) => {
        const active = activePriority === p;
        return (
          <button
            key={p}
            onClick={() => setActivePriority(p as Priority | "all")}
            className="text-[12px] px-3 py-[5px] rounded-full transition-all"
            style={
              active
                ? {
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                  }
                : {
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                    color: "var(--text-2)",
                  }
            }
          >
            {emojis[p]} {p === "all" ? "All priorities" : PRIORITIES[p as Priority].label}
          </button>
        );
      })}
    </div>
  );
}