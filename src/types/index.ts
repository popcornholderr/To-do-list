// ─── TASK ────────────────────────────────────────────────────────────────────

export type Priority = "low" | "medium" | "high" | "critical";
export type Category = "Personal" | "Work" | "Study" | "Health" | "Finance";
export type Theme = "midnight" | "aurora" | "light" | "glass";
export type ViewMode = "all" | "today" | "pending" | "done" | "analytics";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  tags: string[];
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
  order: number;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string;
  tags: string;
}

// ─── STORE ───────────────────────────────────────────────────────────────────

export interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  activeView: ViewMode;
  activeCategory: Category | "all";
  activePriority: Priority | "all";
  activeTheme: Theme;
  activePage: "tasks" | "analytics";
  sidebarOpen: boolean;
  commandOpen: boolean;
  modalOpen: boolean;
  editingTask: Task | null;

  // Actions
  addTask: (data: TaskFormValues) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
  clearCompleted: () => void;
  completeAllVisible: () => void;

  setSearchQuery: (q: string) => void;
  setActiveView: (view: ViewMode) => void;
  setActiveCategory: (cat: Category | "all") => void;
  setActivePriority: (p: Priority | "all") => void;
  setTheme: (t: Theme) => void;
  setActivePage: (page: "tasks" | "analytics") => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setModalOpen: (open: boolean) => void;
  setEditingTask: (task: Task | null) => void;
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export interface WeeklyData {
  day: string;
  completed: number;
  created: number;
}

export interface CategoryData {
  name: Category;
  count: number;
  completed: number;
  color: string;
}

export interface PriorityData {
  name: string;
  value: number;
  color: string;
}

// ─── UI ──────────────────────────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  icon: string;
  label: string;
  shortcut?: string;
  section: string;
  action: () => void;
}