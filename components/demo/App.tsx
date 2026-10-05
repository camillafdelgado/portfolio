import { PersonaTag, SplitCard, StepCarousel } from "../persona-card"

const placeholder = (label: string) => (
  <div
    style={{
      height: 120,
      borderRadius: 8,
      background: "#eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      color: "#888",
    }}
  >
    {label}
  </div>
)

export function App() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "48px auto",
        padding: "0 24px",
        fontFamily: "system-ui, sans-serif",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <section>
        <h2 style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>PersonaTag</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7 }}>
          During testing,{" "}
          <PersonaTag
            name="Melissa"
            role="Family caregiver, lives apart from parents"
            need="Clear next steps without calling the clinic"
          >
            Melissa
          </PersonaTag>{" "}
          rated the feature 1/5. Hover the dashed name to see the card.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>SplitCard</h2>
        <SplitCard
          left={{
            label: "V1 — Wine metaphor",
            badge: "✗",
            badgeType: "bad",
            content: placeholder("Before"),
          }}
          right={{
            label: "Redesign",
            badge: "✓",
            badgeType: "good",
            content: placeholder("After"),
          }}
          caption="Side-by-side comparison"
        />
      </section>

      <section>
        <h2 style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>StepCarousel</h2>
        <StepCarousel
          steps={[
            {
              label: "P1 — Melissa",
              content: <p style={{ margin: 0, lineHeight: 1.6 }}>Rated the feature 1/5 and couldn't tell if her action saved.</p>,
            },
            {
              label: "P2 — Charlie",
              content: <p style={{ margin: 0, lineHeight: 1.6 }}>Couldn't find the button to share results with a family member.</p>,
            },
            {
              label: "P3 — Jamie",
              content: <p style={{ margin: 0, lineHeight: 1.6 }}>Spent 5 minutes confused by the wine metaphor labels.</p>,
            },
          ]}
        />
      </section>
    </main>
  )
}
