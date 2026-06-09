"use client";

import { useMemo } from "react";
import { useTasks } from "@/src/store/taskStore";
import { CATEGORIES, DAYS_SHORT } from "@/src/constants";
import type { WeeklyData, CategoryData, PriorityData } from "@/src/types";
import { getStreakCount, getProductivityScore } from "@/src/lib/utils";

export function useAnalytics() {
  const tasks = useTasks();

  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const streak = getStreakCount(tasks);
    const productivityScore = getProductivityScore(completed, total);

    // Weekly data — last 7 days
    const today = new Date();
    const weeklyData: WeeklyData[] = DAYS_SHORT.map((day, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - 6 + i);
      const ds = d.toISOString().split("T")[0];
      return {
        day,
        completed: tasks.filter(
          (t) => t.completed && t.dueDate === ds
        ).length,
        created: tasks.filter(
          (t) => new Date(t.createdAt).toISOString().split("T")[0] === ds
        ).length,
      };
    });

    // Category distribution
    const categoryData: CategoryData[] = (
      Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>
    ).map((cat) => {
      const catTasks = tasks.filter((t) => t.category === cat);
      return {
        name: cat,
        count: catTasks.length,
        completed: catTasks.filter((t) => t.completed).length,
        color: CATEGORIES[cat].color,
      };
    });

    // Priority distribution
    const priorityData: PriorityData[] = [
      {
        name: "Critical",
        value: tasks.filter((t) => t.priority === "critical").length,
        color: "#f87171",
      },
      {
        name: "High",
        value: tasks.filter((t) => t.priority === "high").length,
        color: "#f97316",
      },
      {
        name: "Medium",
        value: tasks.filter((t) => t.priority === "medium").length,
        color: "#fbbf24",
      },
      {
        name: "Low",
        value: tasks.filter((t) => t.priority === "low").length,
        color: "#34d399",
      },
    ];

    return {
      total,
      completed,
      pending,
      completionRate,
      streak,
      productivityScore,
      weeklyData,
      categoryData,
      priorityData,
    };
  }, [tasks]);
}