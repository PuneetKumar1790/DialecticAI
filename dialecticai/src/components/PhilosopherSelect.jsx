import { useState } from "react"

export default function PhilosopherSelect({
  category,
  selectedIds,
  onToggle,
  onModeChoice,
  onBack
}) {
  const [selectedMode, setSelectedMode] = useState("perspectives")
  const selectedCount = selectedIds.length
  const canContinue = selectedMode === "debate" ? selectedCount === 2 : selectedCount >= 2

  if (!category) {
    return (
      <section className="philosopher-select-wrap empty-state-wrap">
        <p className="empty-state-text">← Go back and choose a category</p>
        <button type="button" className="secondary-btn" onClick={onBack}>
          ← Categories
        </button>
      </section>
    )
  }

  return (
    <section className="philosopher-select-wrap">
      <div className="section-header-row">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Categories
        </button>
      </div>

      <div className="screen-heading center">
        <p className="screen-eyebrow">— your council —</p>
        <h2 className="section-title">{category.label}</h2>
        <p className="section-subtitle">
          Select 2 to 4 philosophers. Each brings a genuinely different lens.
        </p>
      </div>

      <div className="mode-picker" role="tablist" aria-label="Response mode">
        <button
          type="button"
          className={selectedMode === "perspectives" ? "active" : ""}
          onClick={() => setSelectedMode("perspectives")}
        >
          Perspectives
        </button>
        <button
          type="button"
          className={selectedMode === "debate" ? "active" : ""}
          onClick={() => setSelectedMode("debate")}
        >
          Debate
        </button>
      </div>

      {selectedMode === "debate" && (
        <p className="mode-note">Debate requires exactly 2 philosophers</p>
      )}

      <div className="philosopher-grid">
        {category.philosophers.map(philosopher => {
          const selected = selectedIds.includes(philosopher.id)

          return (
            <button
              type="button"
              key={philosopher.id}
              className={`philosopher-card ${selected ? "selected" : ""}`}
              style={selected
                ? { borderLeftColor: philosopher.color, backgroundColor: `${philosopher.color}10` }
                : { borderLeftColor: philosopher.color }}
              onClick={() => onToggle(philosopher)}
            >
              <div className="philosopher-topline">
                <div className="philosopher-topline-left">
                  <span
                    className="philosopher-dot"
                    style={{ backgroundColor: philosopher.color }}
                    aria-hidden="true"
                  />
                  <h3>{philosopher.name}</h3>
                </div>
                <span className="philosopher-era">{philosopher.era}</span>
              </div>
              <p className="philosopher-title">{philosopher.title}</p>
              <p className="philosopher-tagline">{philosopher.tagline}</p>
              {selected && <span className="philosopher-check">✓</span>}
            </button>
          )
        })}
      </div>

      <p className="selected-count">{selectedCount} of 4 selected · minimum 2</p>

      <div className="mode-actions centered">
        <button
          type="button"
          className="primary-btn"
          disabled={!canContinue}
          onClick={() => onModeChoice(selectedMode)}
        >
          Continue →
        </button>
      </div>
    </section>
  )
}
