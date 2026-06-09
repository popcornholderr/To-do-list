"use client";

import { useMemo } from "react";
import { useTaskStore, useTasks } from "@/src/store/taskStore";
import { CATEGORIES } from "@/src/constants";
import type { ViewMode, Category } from "@/src/types";

const QUOTE = "Edit your life frequently and ruthlessly.";
const QUOTE_ATTR = "— Nathan W. Morris";

const views: { id: ViewMode; label: string }[] = [
  { id: "all",       label: "All Tasks" },
  { id: "today",     label: "Today" },
  { id: "pending",   label: "Pending" },
  { id: "done",      label: "Completed" },
  { id: "analytics", label: "Analytics" },
];

function scrollToSection(viewId: string) {
  // Give React a tick to render the tasks view first
  setTimeout(() => {
    const el = document.getElementById(`section-${viewId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 60);
}

export function Sidebar() {
  const { activeView, setActiveView, activeCategory, setActiveCategory, sidebarOpen } =
    useTaskStore();
  const tasks = useTasks();
  const today = new Date().toISOString().split("T")[0];

  const badges = useMemo(() => ({
    all:       tasks.length,
    today:     tasks.filter((t) => t.dueDate === today).length,
    pending:   tasks.filter((t) => !t.completed).length,
    done:      tasks.filter((t) => t.completed).length,
    analytics: null,
  }), [tasks, today]);

  if (!sidebarOpen) return <aside style={{ overflow: "hidden", width: 0 }} />;

  return (
    <aside
      className="flex flex-col overflow-hidden"
      style={{
        background: "var(--bg-0)",
        borderRight: "1px solid var(--border)",
        height: "100%",
      }}
    >
      {/* Logo / brand mark in sidebar */}
      <div style={{
        padding: "28px 22px 20px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontStyle: "italic",
          color: "var(--text-4)",
          letterSpacing: "0.01em",
        }}>
          Your workspace
        </p>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "24px 16px 16px" }}>

        <p style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--text-4)",
          marginBottom: "10px",
          paddingLeft: "10px",
        }}>
          Views
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "28px" }}>
          {views.map((v) => {
            const active = activeView === v.id && activeCategory === "all";
            const badge  = badges[v.id];
            return (
              <button
                key={v.id}
                onClick={() => {
                  setActiveView(v.id);
                  setActiveCategory("all");
                  scrollToSection(v.id);
                }}
                className="flex items-center justify-between w-full text-left transition-all"
                style={{
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: active ? "var(--bg-2)" : "transparent",
                  border: "none",
                }}
              >
                <span style={{
                  fontSize: "13px",
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--text-1)" : "var(--text-3)",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.01em",
                }}>
                  {v.label}
                </span>
                {badge !== null && badge !== undefined && badge > 0 && (
                  <span style={{
                    fontSize: "11px",
                    color: active ? "var(--text-2)" : "var(--text-4)",
                    fontVariantNumeric: "tabular-nums",
                    background: active ? "var(--bg-3)" : "var(--bg-2)",
                    borderRadius: "5px",
                    padding: "2px 7px",
                    minWidth: "22px",
                    textAlign: "center",
                  }}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: "var(--border)", marginBottom: "24px" }} />

        <p style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--text-4)",
          marginBottom: "10px",
          paddingLeft: "10px",
        }}>
          Category
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {(["all", ...Object.keys(CATEGORIES)] as (Category | "all")[]).map((cat) => {
            const active = activeCategory === cat;
            const count  = cat === "all" ? tasks.length : tasks.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  scrollToSection(activeView);
                }}
                className="flex items-center justify-between w-full text-left transition-all"
                style={{
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: active ? "var(--bg-2)" : "transparent",
                  border: "none",
                }}
              >
                <span style={{
                  fontSize: "13px",
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--text-1)" : "var(--text-3)",
                  letterSpacing: "0.01em",
                  fontFamily: "var(--font-body)",
                }}>
                  {cat === "all" ? "All" : cat}
                </span>
                {count > 0 && (
                  <span style={{
                    fontSize: "11px",
                    color: active ? "var(--text-2)" : "var(--text-4)",
                    background: active ? "var(--bg-3)" : "var(--bg-2)",
                    borderRadius: "5px",
                    padding: "2px 7px",
                    minWidth: "22px",
                    textAlign: "center",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quote footer */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 22px",
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "12px",
          lineHeight: 1.6,
          color: "var(--text-4)",
          marginBottom: "6px",
        }}>
          "{QUOTE}"
        </p>
        <p style={{
          fontSize: "10px",
          letterSpacing: "0.06em",
          color: "var(--text-4)",
        }}>
          {QUOTE_ATTR}
        </p>
      </div>
    </aside>
  );
}