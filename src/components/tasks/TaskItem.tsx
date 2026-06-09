"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { useTaskStore } from "@/src/store/taskStore";
import { CATEGORIES, PRIORITIES } from "@/src/constants";
import { formatDate, isOverdue } from "@/src/lib/utils";
import { toast } from "sonner";
import type { Task } from "@/src/types";

interface TaskItemProps { task: Task; index: number; }

// Priority dot colors mapped cleanly
const PRIO_DOT: Record<string, string> = {
  low: "#6aaa7e", medium: "#c9a84c", high: "#c47a3a", critical: "#b84040",
};

export function TaskItem({ task, index }: TaskItemProps) {
  const { toggleTask, deleteTask, setEditingTask } = useTaskStore();
  const prio = PRIORITIES[task.priority];
  const overdue = !task.completed && isOverdue(task.dueDate);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(task.id);
    toast(task.completed ? "Reopened" : "Marked complete");
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
    toast("Deleted");
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: task.completed ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleEdit}
      className="group relative flex items-center gap-5 py-4 cursor-pointer transition-colors"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface-hover)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {/* Priority dot */}
      <div
        className="flex-shrink-0"
        style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: PRIO_DOT[task.priority] || "var(--border-2)",
          opacity: task.completed ? 0.4 : 1,
        }}
      />

      {/* Checkbox */}
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.85 }}
        className="flex-shrink-0 flex items-center justify-center transition-all"
        style={{
          width: 16, height: 16,
          border: task.completed ? "none" : "1px solid var(--border-2)",
          borderRadius: "2px",
          background: task.completed ? "var(--text-1)" : "transparent",
        }}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="var(--bg-0)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-baseline gap-4">
        <p
          className="truncate"
          style={{
            fontSize: "14px",
            fontWeight: task.completed ? 400 : 500,
            color: "var(--text-1)",
            textDecoration: task.completed ? "line-through" : "none",
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-body)",
            flexShrink: 0,
            maxWidth: "55%",
          }}
        >
          {task.title}
        </p>

        <p
          className="truncate hidden sm:block"
          style={{
            fontSize: "12px",
            color: "var(--text-4)",
            letterSpacing: "0.01em",
            flex: 1,
          }}
        >
          {task.description}
        </p>
      </div>

      {/* Right meta — category + date */}
      <div className="hidden md:flex items-center gap-4 flex-shrink-0">
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-4)",
          }}
        >
          {task.category}
        </span>

        {task.dueDate && (
          <span
            className="flex items-center gap-1"
            style={{
              fontSize: "10px",
              letterSpacing: "0.04em",
              color: overdue ? "#b84040" : "var(--text-4)",
            }}
          >
            <Calendar size={9} strokeWidth={1.5} />
            {formatDate(task.dueDate)}
          </span>
        )}

        <span
          style={{
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: PRIO_DOT[task.priority],
          }}
        >
          {prio.label}
        </span>
      </div>

      {/* Actions — appear on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleEdit}
          className="flex items-center justify-center w-7 h-7 transition-all"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "2px",
            color: "var(--text-3)",
            background: "var(--bg-0)",
          }}
          aria-label="Edit"
        >
          <Pencil size={10} strokeWidth={1.75} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          className="flex items-center justify-center w-7 h-7 transition-all"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "2px",
            color: "var(--text-3)",
            background: "var(--bg-0)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#b84040";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,64,64,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
          aria-label="Delete"
        >
          <Trash2 size={10} strokeWidth={1.75} />
        </motion.button>
      </div>
    </motion.div>
  );
}