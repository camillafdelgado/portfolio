"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

// ─────────────────────────────────────────────
// 1. PERSONA TAG
// Usage: wrap a name in body copy to reveal a hover card
//
// <PersonaTag name="Melissa" role="Family caregiver, lives apart from parents">
//   Melissa
// </PersonaTag>
// ─────────────────────────────────────────────

interface PersonaTagProps {
  name: string
  role: string
  need: string
  children: React.ReactNode
}

export function PersonaTag({ name, role, need, children }: PersonaTagProps) {
  const [open, setOpen] = useState(false)

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        style={{
          borderBottom: "1px dashed #999",
          cursor: "default",
          paddingBottom: 1,
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: "10px 14px",
              width: 220,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111" }}>
              {name}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#666", lineHeight: 1.4 }}>
              {role}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#444", lineHeight: 1.4 }}>
              Needed: {need}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}


// ─────────────────────────────────────────────
// 2. SPLIT CARD
// Usage: before/after comparison, or two options side by side
//
// <SplitCard
//   left={{ label: "V1 — Wine metaphor", badge: "✗", content: <img ... /> }}
//   right={{ label: "Redesign", badge: "✓", content: <img ... /> }}
// />
// ─────────────────────────────────────────────

type BadgeType = "bad" | "good" | "neutral"

interface SplitCardSide {
  label: string
  badge?: "✗" | "✓" | string
  badgeType?: BadgeType
  content: React.ReactNode
}

interface SplitCardProps {
  left: SplitCardSide
  right: SplitCardSide
  caption?: string
}

const badgeStyles: Record<BadgeType, React.CSSProperties> = {
  bad: { background: "#fee2e2", color: "#dc2626" },
  good: { background: "#dcfce7", color: "#16a34a" },
  neutral: { background: "#f3f4f6", color: "#374151" },
}

export function SplitCard({ left, right, caption }: SplitCardProps) {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "#e5e5e5",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #e5e5e5",
        }}
      >
        {[left, right].map((side, i) => (
          <div
            key={i}
            style={{
              background: "#fafafa",
              padding: "20px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {side.badge && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 99,
                    ...(badgeStyles[side.badgeType ?? "neutral"]),
                  }}
                >
                  {side.badge}
                </span>
              )}
              <span style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>
                {side.label}
              </span>
            </div>
            <div>{side.content}</div>
          </div>
        ))}
      </div>
      {caption && (
        <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 10 }}>
          {caption}
        </p>
      )}
    </div>
  )
}


// ─────────────────────────────────────────────
// 3. STEP CAROUSEL
// Usage: step through testing moments (P1, P2, P3)
//
// <StepCarousel steps={[
//   { label: "P1 — Melissa", content: <p>Rated the feature 1/5...</p> },
//   { label: "P2 — Charlie", content: <p>Couldn't find the button...</p> },
//   { label: "P3 — Jamie",   content: <p>Spent 5 min confused...</p> },
// ]} />
// ─────────────────────────────────────────────

interface Step {
  label: string
  content: React.ReactNode
}

interface StepCarouselProps {
  steps: Step[]
}

export function StepCarousel({ steps }: StepCarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1)
    setIndex(next)
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 24, filter: "blur(4px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => ({ opacity: 0, x: d * -24, filter: "blur(4px)" }),
  }

  return (
    <div
      style={{
        background: "#fafafa",
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Step content */}
      <div style={{ padding: "28px 28px 20px", minHeight: 160, position: "relative" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#999",
                margin: "0 0 12px",
              }}
            >
              {steps[index].label}
            </p>
            {steps[index].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav bar */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 99,
                background: i === index ? "#111" : "#ddd",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { label: "←", action: () => go(Math.max(0, index - 1)), disabled: index === 0 },
            { label: "→", action: () => go(Math.min(steps.length - 1, index + 1)), disabled: index === steps.length - 1 },
          ].map(({ label, action, disabled }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              style={{
                width: 32,
                height: 32,
                borderRadius: 99,
                border: "1px solid #e5e5e5",
                background: "#fff",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.3 : 1,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
