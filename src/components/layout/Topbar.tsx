"use client";

import { Search, Plus, Menu } from "lucide-react";
import { useTaskStore } from "@/src/store/taskStore";
import { ThemeSwitcher } from "@/src/components/ui/ThemeSwitcher";

export function Topbar() {
  const {
    searchQuery, setSearchQuery,
    setCommandOpen,
    setSidebarOpen, sidebarOpen,
    setModalOpen, setEditingTask,
  } = useTaskStore();

  return (
    <header
      className="flex items-center gap-6 px-8"
      style={{
        background: "var(--bg-0)",
        borderBottom: "1px solid var(--border)",
        gridColumn: "1 / -1",
        height: "100%",
      }}
    >
      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="flex items-center justify-center transition-opacity hover:opacity-40 focus-ring"
        style={{ color: "var(--text-3)" }}
        aria-label="Toggle sidebar"
      >
        <Menu size={18} strokeWidth={1.25} />
      </button>

      {/* Wordmark */}
      <div className="flex items-baseline gap-[7px]">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-1)",
            lineHeight: 1,
          }}
        >
          Euclid
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            color: "var(--text-3)",
            lineHeight: 1,
          }}
        >
          Space Time
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border-2)", flexShrink: 0 }} />

      {/* Search */}
      <div className="relative" style={{ width: "280px" }}>
        <Search
          size={12}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-4)" }}
          strokeWidth={1.5}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks…"
          className="w-full pl-8 pr-4 outline-none transition-all"
          style={{
            background: "var(--bg-1)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            color: "var(--text-1)",
            fontSize: "13px",
            fontFamily: "var(--font-body)",
            padding: "8px 12px 8px 32px",
            letterSpacing: "0.01em",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--border-2)";
            window.dispatchEvent(new CustomEvent("scroll-to-tasks"));
          }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
        />
      </div>

      <div className="flex-1" />

      {/* Theme */}
      <ThemeSwitcher />

      {/* Command shortcut */}
      <button
        onClick={() => setCommandOpen(true)}
        className="hidden sm:flex items-center gap-2 transition-opacity hover:opacity-50"
        style={{ color: "var(--text-4)" }}
      >
        <kbd
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "5px",
            padding: "3px 7px",
            fontSize: "11px",
            fontFamily: "var(--font-body)",
            color: "var(--text-3)",
            letterSpacing: "0.04em",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* New Task */}
      <button
        onClick={() => { setEditingTask(null); setModalOpen(true); }}
        className="flex items-center gap-2 transition-opacity hover:opacity-70 active:scale-[0.97] focus-ring"
        style={{
          background: "var(--text-1)",
          color: "var(--bg-0)",
          borderRadius: "6px",
          padding: "8px 18px",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontFamily: "var(--font-body)",
        }}
      >
        <Plus size={13} strokeWidth={2} />
        <span className="hidden sm:inline">New</span>
      </button>
    </header>
  );
}