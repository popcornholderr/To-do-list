"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";

    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };

    const animate = () => {
      // Dot follows cursor instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px)`;
      }
      // Ring follows with lerp for smooth lag
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    // Scale up ring on clickable elements
    const onEnter = () => {
      ringRef.current?.style.setProperty("width", "40px");
      ringRef.current?.style.setProperty("height", "40px");
      ringRef.current?.style.setProperty("opacity", "0.6");
    };
    const onLeave = () => {
      ringRef.current?.style.setProperty("width", "28px");
      ringRef.current?.style.setProperty("height", "28px");
      ringRef.current?.style.setProperty("opacity", "0.35");
    };

    const addHover = () => {
      document.querySelectorAll("a, button, [role=button], input, textarea, select").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    addHover();

    // Re-attach on DOM changes
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#6366f1",
          marginLeft: -3,
          marginTop: -3,
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-[width,height,opacity] duration-200"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid #6366f1",
          opacity: 0.35,
          marginLeft: -14,
          marginTop: -14,
          willChange: "transform",
        }}
      />
    </>
  );
}