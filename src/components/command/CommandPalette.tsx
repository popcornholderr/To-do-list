"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, BarChart2, CheckSquare, Trash2, X, Clock, List } from "lucide-react";
import { useTaskStore } from "@/src/store/taskStore";
import type { ViewMode } from "@/src/types";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const {
    commandOpen, setCommandOpen,
    setModalOpen, setEditingTask,
    setActiveView, tasks, clearCompleted,
  } = useTaskStore();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "new-task",
      label: "New Task",
      description: "Create a new task",
      icon: <Plus size={15} strokeWidth={1.75} />,
      keywords: "create add new task",
      action: () => { setEditingTask(null); setModalOpen(true); setCommandOpen(false); },
    },
    {
      id: "view-all",
      label: "All Tasks",
      description: "View all tasks",
      icon: <List size={15} strokeWidth={1.75} />,
      keywords: "tasks list view all",
      action: () => { setActiveView("all" as ViewMode); setCommandOpen(false); },
    },
    {
      id: "view-pending",
      label: "Pending",
      description: "Show incomplete tasks",
      icon: <CheckSquare size={15} strokeWidth={1.75} />,
      keywords: "pending incomplete",
      action: () => { setActiveView("pending" as ViewMode); setCommandOpen(false); },
    },
    {
      id: "view-today",
      label: "Today",
      description: "Tasks due today",
      icon: <Clock size={15} strokeWidth={1.75} />,
      keywords: "today due",
      action: () => { setActiveView("today" as ViewMode); setCommandOpen(false); },
    },
    {
      id: "view-done",
      label: "Completed",
      description: "Finished tasks",
      icon: <BarChart2 size={15} strokeWidth={1.75} />,
      keywords: "done completed finished",
      action: () => { setActiveView("done" as ViewMode); setCommandOpen(false); },
    },
    {
      id: "clear-completed",
      label: "Clear Completed",
      description: `Remove ${tasks.filter((t) => t.completed).length} completed tasks`,
      icon: <Trash2 size={15} strokeWidth={1.75} />,
      keywords: "clear delete remove completed done",
      action: () => { clearCompleted?.(); setCommandOpen(false); },
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.keywords?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (commandOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [commandOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCommandOpen(!commandOpen); }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[2000] flex items-start justify-center px-6"
          style={{ paddingTop: "16vh", background: "rgba(0,0,0,0.22)", backdropFilter: "blur(6px)" }}
          onClick={() => setCommandOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.18, ease: [0.34, 1.1, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "540px",
              borderRadius: "18px",
              overflow: "hidden",
              background: "var(--bg-0)",
              border: "1px solid var(--border-2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Search bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 20px",
              borderBottom: "1px solid var(--border)",
            }}>
              <Search size={16} strokeWidth={1.75} style={{ color: "var(--text-4)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                style={{
                  flex: 1,
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  fontSize: "15px",
                  color: "var(--text-1)",
                  fontFamily: "inherit",
                  letterSpacing: "-0.02em",
                }}
              />
              <button
                onClick={() => setCommandOpen(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-4)",
                  background: "var(--bg-2)",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={13} strokeWidth={2} />
              </button>
            </div>

            {/* Command list */}
            <div style={{ padding: "8px", maxHeight: "340px", overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <p style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "var(--text-4)",
                  fontFamily: "inherit",
                }}>
                  No results
                </p>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <span style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-2)",
                      color: "var(--text-2)",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                    }}>
                      {cmd.icon}
                    </span>
                    <div>
                      <p style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "var(--text-1)",
                        letterSpacing: "-0.01em",
                        fontFamily: "inherit",
                        marginBottom: "2px",
                      }}>
                        {cmd.label}
                      </p>
                      {cmd.description && (
                        <p style={{
                          fontSize: "12px",
                          color: "var(--text-4)",
                          fontFamily: "inherit",
                        }}>
                          {cmd.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
            }}>
              {[["Esc", "close"], ["↵", "select"]].map(([key, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <kbd style={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "5px",
                    padding: "2px 7px",
                    fontSize: "11px",
                    color: "var(--text-3)",
                    fontFamily: "inherit",
                  }}>
                    {key}
                  </kbd>
                  <span style={{ fontSize: "11px", color: "var(--text-4)" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}