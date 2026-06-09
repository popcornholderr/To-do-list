"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/src/store/taskStore";
import { useKeyboard } from "@/src/hooks/useKeyboard";
import { CustomCursor } from "@/src/components/ui/CustomCursor";
import { Topbar } from "@/src/components/layout/Topbar";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { MainContent } from "@/src/components/layout/MainContent";
import { TaskModal } from "@/src/components/tasks/TaskModal";
import { CommandPalette } from "@/src/components/command/CommandPalette";

const SCALE = 1.15;

export function AppShell() {
  useKeyboard();
  const { activeTheme, sidebarOpen } = useTaskStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  return (
    <>
      <CustomCursor />

      {/* Outer frame */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg-0)",
          boxSizing: "border-box",
          /* Scale the whole app up from top-left, then shift it back so it
             fills the viewport. width/height are divided by SCALE so that
             after scaling the element exactly covers the screen — this keeps
             all pointer events perfectly aligned with the visual cursor. */
          width: `${100 / SCALE}%`,
          height: `${100 / SCALE}%`,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {/* White padding frame */}
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "12px",
            boxSizing: "border-box",
            background: "var(--bg-0)",
          }}
        >
          {/* Inner app container */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              display: "grid",
              gridTemplateRows: "68px 1fr",
              background: "var(--bg-0)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Topbar />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: sidebarOpen ? "260px 1fr" : "0px 1fr",
                transition: "grid-template-columns 0.35s cubic-bezier(0.22,1,0.36,1)",
                overflow: "hidden",
              }}
            >
              <Sidebar />
              <MainContent />
            </div>
          </div>
        </div>
      </div>

      <TaskModal />
      <CommandPalette />
    </>
  );
}