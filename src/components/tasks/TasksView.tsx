"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTaskStore, useFilteredTasks } from "@/src/store/taskStore";
import { StatsRow } from "@/src/components/dashboard/StatsRow";
import { TaskItem } from "@/src/components/tasks/TaskItem";
import { EmptyState } from "@/src/components/tasks/EmptyState";
import type { Priority } from "@/src/types";
import { PRIORITIES } from "@/src/constants";

const VIEW_TITLES: Record<string, string> = {
  all: "All Tasks", today: "Today", pending: "Pending", done: "Completed",
};
const PRIORITY_FILTERS: (Priority | "all")[] = ["all", "low", "medium", "high", "critical"];

const MARQUEE_WORDS = [
  "FOCUS", "EXECUTE", "DELIVER", "PRIORITISE", "ACHIEVE",
  "FOCUS", "EXECUTE", "DELIVER", "PRIORITISE", "ACHIEVE",
];

const BANNER_PHOTOS = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80&fit=crop",
];

function useRandomPhoto() {
  const [photo] = useState<string>(
    () => BANNER_PHOTOS[Math.floor(Math.random() * BANNER_PHOTOS.length)]
  );
  return photo;
}

export function TasksView() {
  const { activeView, activeCategory, activePriority, setActivePriority, searchQuery } = useTaskStore();
  const filtered = useFilteredTasks();
  const titleRef  = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bannerPhoto = useRandomPhoto();

  // ── Framer scroll tracking on the container ──────────────────────────────
  const { scrollY } = useScroll({ container: scrollRef });

  // Image moves up slowly (parallax: 0.38x scroll speed)
  const imageY = useTransform(scrollY, [0, 500], [0, -110]);
  const imageYSpring = useSpring(imageY, { stiffness: 80, damping: 28, mass: 0.6 });

  // Stats move up faster than image (0.72x scroll speed)
  const statsY = useTransform(scrollY, [0, 500], [0, -200]);
  const statsYSpring = useSpring(statsY, { stiffness: 90, damping: 26, mass: 0.5 });

  // Image fades much later — starts at 400px, fully gone at 750px
  const imageOpacity = useTransform(scrollY, [400, 750], [1, 0]);
  // Stats fade a bit earlier but still delayed — starts at 320px, gone at 620px
  const statsOpacity = useTransform(scrollY, [320, 620], [1, 0]);

  // ── Topbar hide/show on scroll ────────────────────────────────────────────
  const setTopbarVisible = useTaskStore((s) => (s as any).setTopbarVisible);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cur = el.scrollTop;
      if (typeof setTopbarVisible === "function") {
        setTopbarVisible(cur < lastScrollY.current || cur < 40);
      }
      lastScrollY.current = cur;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [setTopbarVisible]);

  // ── Scroll to title on view/category/search change ────────────────────────
  const { pending, completed } = useMemo(() => ({
    pending:   filtered.filter((t) => !t.completed),
    completed: filtered.filter((t) => t.completed),
  }), [filtered]);

  const isSearching = searchQuery.trim().length > 0;

  const title = isSearching
    ? `Results for "${searchQuery}"`
    : activeCategory !== "all"
    ? activeCategory
    : (VIEW_TITLES[activeView] || "Tasks");

  const dayOfWeek = new Date().toLocaleDateString("en-GB", { weekday: "long" });
  const dateStr   = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const scrollToTitle = useCallback(() => {
  if (!titleRef.current || !scrollRef.current) return;
  // getBoundingClientRect gives position relative to viewport;
  // add scrollRef's current scrollTop to get the absolute offset inside the container
  const containerTop = scrollRef.current.getBoundingClientRect().top;
  const titleTop = titleRef.current.getBoundingClientRect().top;
  const relativeTop = scrollRef.current.scrollTop + (titleTop - containerTop) - 32;
  scrollRef.current.scrollTo({ top: relativeTop, behavior: "smooth" });
}, []);

// Scroll to title on tab/category change — skip the very first mount
const isMounted = useRef(false);
useEffect(() => {
  if (!isMounted.current) { isMounted.current = true; return; }
  const t = setTimeout(scrollToTitle, 80);
  return () => clearTimeout(t);
}, [activeView, activeCategory, scrollToTitle]);

// Scroll to title when search is activated
useEffect(() => {
  if (isSearching) {
    const t = setTimeout(scrollToTitle, 80);
    return () => clearTimeout(t);
  }
}, [isSearching, scrollToTitle]);

// Listen for search-bar focus event dispatched from Topbar
useEffect(() => {
  const handler = () => setTimeout(scrollToTitle, 80);
  window.addEventListener("scroll-to-tasks", handler);
  return () => window.removeEventListener("scroll-to-tasks", handler);
}, [scrollToTitle]);

  return (
    <div
      ref={scrollRef}
      style={{ height: "100%", overflowY: "auto", position: "relative" }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          PARALLAX HERO — sticky container so image stays in place
          while content scrolls over it
      ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        padding: "48px 48px 0",
        maxWidth: "860px",
        margin: "0 auto",
      }}>

        {/* Image block — moves up at 0.38x speed */}
        <motion.div
          style={{ y: imageYSpring, opacity: imageOpacity }}
        >
          <div style={{
            position: "relative",
            width: "100%",
            height: "420px",
            overflow: "hidden",
            borderRadius: "14px",
            marginBottom: "32px",
            background: "var(--bg-2)",
          }}>
            {bannerPhoto && (
              <img
                src={bannerPhoto}
                alt="Daily inspiration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 35%",
                  filter: "brightness(0.75) contrast(1.08) saturate(0.85)",
                }}
              />
            )}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(25,21,16,0.18) 0%, rgba(25,21,16,0.62) 100%)",
            }} />

            {/* Marquee at top of image */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              overflow: "hidden",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              padding: "10px 0",
              background: "rgba(25,21,16,0.28)",
              backdropFilter: "blur(2px)",
            }}>
              <div className="marquee-track">
                {MARQUEE_WORDS.map((w, i) => (
                  <span key={i} style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    color: i % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                    paddingRight: "44px",
                  }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Date overlay */}
            <div style={{ position: "absolute", bottom: "28px", left: "28px" }}>
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "12px", color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.02em", lineHeight: 1.4, marginBottom: "5px",
              }}>
                {dayOfWeek}
              </p>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "32px",
                fontWeight: 700, color: "#fff",
                letterSpacing: "-0.03em", lineHeight: 1,
              }}>
                {dateStr}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats — moves up at 0.72x speed (faster than image) */}
        <motion.div
          style={{ y: statsYSpring, opacity: statsOpacity, marginBottom: "32px" }}
        >
          <StatsRow />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TASK CONTENT — normal flow, sits below the parallax blocks
      ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "0 48px 80px",
        position: "relative",
        zIndex: 2,
        background: "var(--bg-0)",
        borderRadius: "12px 12px 0 0",
        marginTop: "-12px",          /* slight overlap for smooth handoff */
      }}>

        {/* Section title */}
        <div
          ref={titleRef}
          style={{ paddingTop: "36px", marginBottom: "28px", scrollMarginTop: "32px" }}
        >
          {/* Brown date strip */}
          <motion.div
            key={`strip-${title}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "12px", paddingBottom: "10px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "11px", color: "#8B6F47", fontFamily: "var(--font-body)", letterSpacing: "0.05em", opacity: 0.85 }}>
              {dayOfWeek}
            </span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#8B6F47", opacity: 0.4, display: "inline-block" }} />
            <span style={{ fontSize: "11px", color: "#8B6F47", fontFamily: "var(--font-body)", letterSpacing: "0.05em", opacity: 0.85 }}>
              {dateStr}
            </span>
            {isSearching && (
              <>
                <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#8B6F47", opacity: 0.4, display: "inline-block" }} />
                <span style={{ fontSize: "11px", color: "#8B6F47", fontFamily: "var(--font-body)", letterSpacing: "0.05em", opacity: 0.85 }}>Searching</span>
              </>
            )}
          </motion.div>

          {/* Main title */}
          <motion.div
            key={`title-${title}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
          >
            <div className="flex items-baseline gap-4" style={{ marginBottom: "6px" }}>
              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 700,
                letterSpacing: "-0.04em", color: "var(--text-1)", lineHeight: 1,
              }}>
                {title}
              </h1>
              <span style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "22px", color: "var(--text-4)", lineHeight: 1,
              }}>
                {filtered.length}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-4)", fontFamily: "var(--font-body)", letterSpacing: "0.01em" }}>
              {pending.length} remaining · {completed.length} completed
            </p>
          </motion.div>
        </div>

        {/* Priority filters */}
        <div className="flex gap-2 flex-wrap" style={{ marginBottom: "24px" }}>
          {PRIORITY_FILTERS.map((p) => {
            const active = activePriority === p;
            return (
              <button
                key={p}
                onClick={() => setActivePriority(p)}
                style={{
                  borderRadius: "6px", padding: "6px 16px",
                  fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em",
                  textTransform: "uppercase", fontFamily: "var(--font-body)",
                  background: active ? "var(--text-1)" : "var(--bg-1)",
                  border: `1px solid ${active ? "var(--text-1)" : "var(--border)"}`,
                  color: active ? "var(--bg-0)" : "var(--text-3)",
                  transition: "all 0.15s ease", cursor: "pointer",
                }}
              >
                {p === "all" ? "All" : PRIORITIES[p as Priority].label}
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: "var(--border)", marginBottom: "20px" }} />

        {/* Task list */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col">
            <AnimatePresence mode="popLayout" initial={false}>
              {pending.map((task, i) => (
                <TaskItem key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>

            {completed.length > 0 && (
              <>
                <div className="flex items-center gap-4" style={{ margin: "40px 0 20px" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em",
                    textTransform: "uppercase", color: "var(--text-4)", flexShrink: 0,
                  }}>
                    Completed
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-4)" }}>{completed.length}</span>
                </div>
                <AnimatePresence mode="popLayout" initial={false}>
                  {completed.map((task, i) => (
                    <TaskItem key={task.id} task={task} index={i} />
                  ))}
                </AnimatePresence>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}