"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/src/store/taskStore";

export function EmptyState() {
  const { setModalOpen, setEditingTask } = useTaskStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      {/* Decorative mark */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-[1px] h-16"
        style={{ background: "linear-gradient(to bottom, transparent, var(--border-2), transparent)" }}
      />

      <div>
        <p
          className="text-[15px] font-[480] mb-2"
          style={{ color: "var(--text-2)", letterSpacing: "-0.02em" }}
        >
          Nothing here yet
        </p>
        <p className="text-[13px]" style={{ color: "var(--text-4)" }}>
          Add your first task to get started.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { setEditingTask(null); setModalOpen(true); }}
        className="flex items-center gap-2 mt-1 px-5 py-[9px] rounded-xl text-[13px] font-medium transition-opacity hover:opacity-75"
        style={{
          background: "var(--text-1)",
          color: "var(--bg-0)",
          letterSpacing: "-0.01em",
        }}
      >
        <Plus size={13} strokeWidth={2} />
        Create Task
      </motion.button>
    </motion.div>
  );
}