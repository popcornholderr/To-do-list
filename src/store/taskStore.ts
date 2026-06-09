"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRef } from "react";
import type { Task, TaskStore, TaskFormValues, ViewMode, Priority, Category, Theme } from "@/src/types";
import { uid } from "@/src/lib/utils";
import { SEED_TASKS, STORAGE_KEY } from "@/src/constants";

function createTask(data: TaskFormValues, order: number): Task {
  return {
    id: uid(),
    title: data.title.trim(),
    description: data.description?.trim() || "",
    priority: data.priority,
    category: data.category,
    dueDate: data.dueDate || null,
    tags: data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
    order,
  };
}

function seedTasks(): Task[] {
  return SEED_TASKS.map((s, i) => ({
    id: uid(),
    title: s.title,
    description: s.description,
    priority: s.priority,
    category: s.category,
    dueDate: s.dueDate,
    tags: s.tags,
    completed: i === 2 || i === 6,
    createdAt: Date.now() - (SEED_TASKS.length - i) * 3600000,
    completedAt:
      i === 2 || i === 6 ? Date.now() - (SEED_TASKS.length - i) * 3600000 : null,
    order: i,
  }));
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      searchQuery: "",
      activeView: "all",
      activeCategory: "all",
      activePriority: "all",
      activeTheme: "midnight",
      activePage: "tasks",
      sidebarOpen: false, // ← hidden by default
      commandOpen: false,
      modalOpen: false,
      editingTask: null,

      addTask: (data) => {
        const tasks = get().tasks;
        const newTask = createTask(data, tasks.length);
        set({ tasks: [newTask, ...tasks] });
      },

      updateTask: (id, data) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          editingTask: state.editingTask?.id === id ? null : state.editingTask,
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null }
              : t
          ),
        }));
      },

      reorderTasks: (fromIndex, toIndex) => {
        const tasks = [...get().tasks];
        const [moved] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, moved);
        set({ tasks: tasks.map((t, i) => ({ ...t, order: i })) });
      },

      clearCompleted: () => {
        set((state) => ({ tasks: state.tasks.filter((t) => !t.completed) }));
      },

      completeAllVisible: () => {
        const { tasks, activeView, activeCategory, activePriority, searchQuery } = get();
        const today = new Date().toISOString().split("T")[0];
        const q = searchQuery.toLowerCase();

        const visibleIds = new Set(
          tasks
            .filter((t) => {
              if (activeView === "today" && t.dueDate !== today) return false;
              if (activeView === "pending" && t.completed) return false;
              if (activeView === "done" && !t.completed) return false;
              if (activeCategory !== "all" && t.category !== activeCategory) return false;
              if (activePriority !== "all" && t.priority !== activePriority) return false;
              if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q))
                return false;
              return !t.completed;
            })
            .map((t) => t.id)
        );

        set((state) => ({
          tasks: state.tasks.map((t) =>
            visibleIds.has(t.id) ? { ...t, completed: true, completedAt: Date.now() } : t
          ),
        }));
      },

      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveView: (view: ViewMode) => set({ activeView: view }),
      setActiveCategory: (cat: Category | "all") => set({ activeCategory: cat }),
      setActivePriority: (p: Priority | "all") => set({ activePriority: p }),
      setTheme: (t: Theme) => set({ activeTheme: t }),
      setActivePage: (page: "tasks" | "analytics") => set({ activePage: page }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCommandOpen: (open) => set({ commandOpen: open }),
      setModalOpen: (open) => set({ modalOpen: open }),
      setEditingTask: (task) => set({ editingTask: task, modalOpen: task !== null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") return sessionStorage;
        return localStorage;
      }),
      partialize: (state) => ({
        tasks: state.tasks,
        activeTheme: state.activeTheme,
        // sidebarOpen intentionally NOT persisted so it resets to false on reload
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.tasks.length === 0) {
          state.tasks = seedTasks();
        }
      },
    }
  )
);

export const useTasks = () => useTaskStore((s) => s.tasks);

export function useFilteredTasks(): Task[] {
  const tasks = useTaskStore((s) => s.tasks);
  const activeView = useTaskStore((s) => s.activeView);
  const activeCategory = useTaskStore((s) => s.activeCategory);
  const activePriority = useTaskStore((s) => s.activePriority);
  const searchQuery = useTaskStore((s) => s.searchQuery);

  const today = new Date().toISOString().split("T")[0];
  const q = searchQuery.toLowerCase();

  const filtered = tasks.filter((t) => {
    if (activeView === "today" && t.dueDate !== today) return false;
    if (activeView === "pending" && t.completed) return false;
    if (activeView === "done" && !t.completed) return false;
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    if (activePriority !== "all" && t.priority !== activePriority) return false;
    if (
      q &&
      !t.title.toLowerCase().includes(q) &&
      !t.description.toLowerCase().includes(q) &&
      !t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
      return false;
    return true;
  });

  const cacheRef = useRef<Task[]>([]);
  const prev = cacheRef.current;
  const same =
    prev.length === filtered.length &&
    filtered.every((t, i) => t === prev[i]);

  if (!same) cacheRef.current = filtered;
  return cacheRef.current;
}