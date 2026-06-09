"use client";

import { useTaskStore } from "@/src/store/taskStore";
import { TasksView } from "@/src/components/tasks/TasksView";
import { AnalyticsDashboard } from "@/src/components/analytics/AnalyticsDashboard";

export function MainContent() {
  const activePage = useTaskStore((s) => (s as any).activePage ?? "tasks");
  const activeView = useTaskStore((s) => s.activeView);
  const isAnalytics = activePage === "analytics" || activeView === "analytics";

  // TasksView owns its own scroll container + hero + stats.
  // Analytics gets the same plain wrapper it had before.
  if (isAnalytics) {
    return (
      <main
        className="overflow-y-auto h-full"
        style={{ background: "var(--bg-0)" }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 48px 80px" }}>
          <AnalyticsDashboard />
        </div>
      </main>
    );
  }

  // TasksView renders its own <div ref={scrollRef}> with padding — no wrapper needed
  return (
    <main className="h-full overflow-hidden" style={{ background: "var(--bg-0)" }}>
      <TasksView />
    </main>
  );
}