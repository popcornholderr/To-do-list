"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/src/store/taskStore";

export function useKeyboard() {
  const { setCommandOpen, commandOpen, setModalOpen, modalOpen, editingTask, setEditingTask } =
    useTaskStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      // ⌘K — Command palette
      if (meta && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
        return;
      }

      // ⌘N — New task
      if (meta && e.key === "n") {
        e.preventDefault();
        setCommandOpen(false);
        setEditingTask(null);
        setModalOpen(true);
        return;
      }

      // Escape — close modals
      if (e.key === "Escape") {
        if (commandOpen) { setCommandOpen(false); return; }
        if (modalOpen) {
          setModalOpen(false);
          setEditingTask(null);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, modalOpen, editingTask, setCommandOpen, setModalOpen, setEditingTask]);
}