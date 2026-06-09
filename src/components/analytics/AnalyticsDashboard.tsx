"use client";

import { motion } from "framer-motion";
import { useTaskStore } from "@/src/store/taskStore";
import { PRIORITIES, CATEGORIES } from "@/src/constants";
import type { Priority, Category } from "@/src/types";

export function AnalyticsDashboard() {
  const tasks = useTaskStore((s) => s.tasks);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byPriority = (Object.keys(PRIORITIES) as Priority[]).map((p) => ({
    label: PRIORITIES[p].label,
    count: tasks.filter((t) => t.priority === p).length,
    barColor: PRIORITIES[p].barColor,
  }));

  const byCategory = (Object.keys(CATEGORIES) as Category[]).map((c) => ({
    label: c,
    count: tasks.filter((t) => t.category === c).length,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* Heading */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "var(--text-1)",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          Analytics
        </motion.h1>
        <p style={{ fontSize: "13px", color: "var(--text-4)", fontFamily: "var(--font-body)" }}>
          An overview of your task performance
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Total",   value: total,             sub: "tasks" },
          { label: "Done",    value: completed,          sub: "completed", accent: true },
          { label: "Pending", value: pending,            sub: "remaining" },
          { label: "Rate",    value: `${completionRate}%`, sub: "completion" },
        ].map(({ label, value, sub, accent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: accent ? "var(--text-1)" : "var(--bg-1)",
              border: `1px solid ${accent ? "transparent" : "var(--border)"}`,
              borderRadius: "12px",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accent ? "rgba(255,255,255,0.45)" : "var(--text-4)",
              fontFamily: "var(--font-body)",
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "40px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: accent ? "#fff" : "var(--text-1)",
              lineHeight: 1,
            }}>
              {value}
            </span>
            <span style={{
              fontSize: "12px",
              color: accent ? "rgba(255,255,255,0.4)" : "var(--text-4)",
              fontFamily: "var(--font-body)",
            }}>
              {sub}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        style={{
          background: "var(--bg-1)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "32px",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
          <span style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-2)",
            fontFamily: "var(--font-body)",
            letterSpacing: "-0.01em",
          }}>
            Overall Progress
          </span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-1)",
            letterSpacing: "-0.03em",
          }}>
            {completionRate}%
          </span>
        </div>
        <div style={{ height: "4px", borderRadius: "99px", background: "var(--bg-3)", overflow: "hidden", marginBottom: "14px" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: "99px", background: "var(--text-1)" }}
          />
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-4)", fontFamily: "var(--font-body)" }}>
          {completed} of {total} tasks completed
        </span>
      </motion.div>

      {/* Priority + Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* By Priority */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "var(--bg-1)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "28px",
          }}
        >
          <p style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-4)",
            fontFamily: "var(--font-body)",
            marginBottom: "24px",
          }}>
            By Priority
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {byPriority.map(({ label, count, barColor }) => (
              <div key={label}>
                <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-2)", fontFamily: "var(--font-body)" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)", fontVariantNumeric: "tabular-nums" }}>{count}</span>
                </div>
                <div style={{ height: "3px", borderRadius: "99px", background: "var(--bg-3)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    style={{ height: "100%", borderRadius: "99px", background: barColor, opacity: 0.75 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* By Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          style={{
            background: "var(--bg-1)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "28px",
          }}
        >
          <p style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-4)",
            fontFamily: "var(--font-body)",
            marginBottom: "24px",
          }}>
            By Category
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {byCategory.map(({ label, count }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ fontSize: "13px", color: "var(--text-2)", fontFamily: "var(--font-body)" }}>{label}</span>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: "80px",
                    height: "3px",
                    borderRadius: "99px",
                    background: "var(--bg-3)",
                    overflow: "hidden",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                      transition={{ duration: 0.7, delay: 0.45 }}
                      style={{ height: "100%", borderRadius: "99px", background: "var(--text-3)" }}
                    />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)", fontVariantNumeric: "tabular-nums", minWidth: "16px", textAlign: "right" }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}