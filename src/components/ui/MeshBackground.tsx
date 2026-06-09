"use client";

export function MeshBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
      style={{ background: "var(--bg-0)" }}
    />
  );
}