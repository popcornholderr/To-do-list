"use client";

import { useMemo } from "react";
import { StatsRow } from "@/src/components/dashboard/StatsRow";

// A pool of freely-licensed Unsplash photos that match the warm editorial tone.
// Each reload picks one at random (seeded to the session so it doesn't flicker on re-render).
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&q=80", // laptop + coffee desk
  "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1400&q=80", // notebook pen
  "https://images.unsplash.com/photo-1483546416237-76fd26bbcdd1?w=1400&q=80", // minimal desk
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1400&q=80", // warm workspace
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1400&q=80", // creative work
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400&q=80", // focused work
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80", // pen paper work
];

const MARQUEE_WORDS = [
  "FOCUS", "EXECUTE", "DELIVER", "PRIORITISE", "ACHIEVE",
  "FOCUS", "EXECUTE", "DELIVER", "PRIORITISE", "ACHIEVE",
];

// Pick image once per page load (not on every render)
const SESSION_IMAGE = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];

export function HeroSection() {
  const now = new Date();
  const day = now.toLocaleDateString("en-GB", { weekday: "long" });
  const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 48px 0" }}>

      {/* ── Hero image block ── */}
      <div
        className="scroll-reveal"
        style={{
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          height: "420px",          /* bigger than before */
          marginBottom: "24px",
        }}
      >
        {/* Marquee — sits at top of image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: "rgba(20,16,10,0.52)",
            backdropFilter: "blur(2px)",
            padding: "9px 0",
            overflow: "hidden",
          }}
        >
          <div className="marquee-track" style={{ gap: 0 }}>
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,248,238,0.72)",
                  padding: "0 28px",
                  flexShrink: 0,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Background image */}
        <img
          src={SESSION_IMAGE}
          alt="Workspace"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,8,5,0.72) 0%, rgba(10,8,5,0.18) 55%, transparent 100%)",
          }}
        />

        {/* Date overlay — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "28px",
            zIndex: 5,
          }}
        >
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "14px",
            color: "rgba(255,248,238,0.65)",
            marginBottom: "4px",
            letterSpacing: "0.01em",
          }}>
            {day}
          </p>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            {date}
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="scroll-reveal" style={{ transitionDelay: "0.1s", marginBottom: "48px" }}>
        <StatsRow />
      </div>
    </div>
  );
}