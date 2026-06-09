"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useTaskStore } from "@/src/store/taskStore";
import { CATEGORIES, PRIORITIES } from "@/src/constants";
import type { TaskFormValues, Category, Priority } from "@/src/types";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).default(""),
  priority: z.enum(["low", "medium", "high", "critical"]),
  category: z.enum(["Personal", "Work", "Study", "Health", "Finance"]),
  dueDate: z.string().default(""),
  tags: z.string().default(""),
});

const inputStyle: React.CSSProperties = {
  background: "var(--bg-1)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  color: "var(--text-1)",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
  letterSpacing: "-0.01em",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  marginBottom: "8px",
  color: "var(--text-4)",
  fontFamily: "inherit",
};

export function TaskModal() {
  const { modalOpen, editingTask, setModalOpen, setEditingTask, addTask, updateTask } =
    useTaskStore();

  const isEdit = !!editingTask;
  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", priority: "medium",
      category: "Work", dueDate: today, tags: "",
    },
  });

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        category: editingTask.category,
        dueDate: editingTask.dueDate || today,
        tags: editingTask.tags.join(", "),
      });
    } else {
      reset({ title: "", description: "", priority: "medium", category: "Work", dueDate: today, tags: "" });
    }
  }, [editingTask, reset, today]);

  const onClose = () => { setModalOpen(false); setEditingTask(null); };

  const onSubmit = (data: TaskFormValues) => {
    if (isEdit && editingTask) {
      updateTask(editingTask.id, {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        priority: data.priority,
        category: data.category,
        dueDate: data.dueDate || null,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      toast("Task updated");
    } else {
      addTask(data);
      toast("Task created");
    }
    onClose();
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--border-2)";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.05)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.22, ease: [0.34, 1.2, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
              overflow: "hidden",
              background: "var(--bg-0)",
              border: "1px solid var(--border-2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "28px 28px 24px",
                borderBottom: "1px solid var(--border)",
              }}>
                <div>
                  <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--text-1)",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}>
                    {isEdit ? "Edit Task" : "New Task"}
                  </h2>
                  <p style={{
                    fontSize: "12px",
                    color: "var(--text-4)",
                    fontFamily: "var(--font-body)",
                  }}>
                    {isEdit ? "Update the details below" : "Fill in the details to get started"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-3)",
                    background: "var(--bg-2)",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-3)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-2)")}
                >
                  <X size={15} strokeWidth={2} />
                </button>
              </div>

              {/* Body */}
              <div style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}>
                {/* Title */}
                <div>
                  <label style={labelStyle}>Title</label>
                  <input
                    {...register("title")}
                    placeholder="What needs doing?"
                    style={inputStyle}
                    autoFocus
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                  {errors.title && (
                    <p style={{ fontSize: "12px", marginTop: "6px", color: "#c0392b" }}>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    {...register("description")}
                    placeholder="Additional details…"
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "88px", lineHeight: 1.6 }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>

                {/* Priority + Category */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Priority</label>
                    <select
                      {...register("priority")}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999590' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        paddingRight: "32px",
                        cursor: "pointer",
                      }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    >
                      {(Object.keys(PRIORITIES) as Priority[]).map((p) => (
                        <option key={p} value={p}>{PRIORITIES[p].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      {...register("category")}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999590' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        paddingRight: "32px",
                        cursor: "pointer",
                      }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    >
                      {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date + Tags */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Due Date</label>
                    <input
                      {...register("dueDate")}
                      type="date"
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tags</label>
                    <input
                      {...register("tags")}
                      placeholder="Design, Dev…"
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "10px",
                padding: "20px 28px 24px",
                borderTop: "1px solid var(--border)",
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-3)",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 500,
                    background: "var(--text-1)",
                    color: "var(--bg-0)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {isEdit ? "Save changes" : "Create Task"}
                </motion.button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
