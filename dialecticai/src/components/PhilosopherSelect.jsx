export default function PhilosopherSelect({
  category,
  selectedIds,
  onToggle,
  onModeChoice,
  onBack
}) {
  const selectedCount = selectedIds.length

  return (
    <section className="philosopher-select-wrap">
      <div className="section-header-row">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Back
        </button>
        <span className="selected-count">{selectedCount} of 4 selected</span>
      </div>

      <h2 className="section-title">Pick The Minds</h2>
      <p className="section-subtitle">{category.label}</p>

      <div className="philosopher-grid">
        {category.philosophers.map(philosopher => {
          const selected = selectedIds.includes(philosopher.id)

          return (
            <button
              type="button"
              key={philosopher.id}
              className={`philosopher-card ${selected ? "selected" : ""}`}
              style={selected ? { borderLeftColor: philosopher.color } : undefined}
              onClick={() => onToggle(philosopher)}
            >
              <div className="philosopher-topline">
                <span
                  className="philosopher-dot"
                  style={{ backgroundColor: philosopher.color }}
                  aria-hidden="true"
                />
                <h3>{philosopher.name}</h3>
              </div>
              <p className="philosopher-title">{philosopher.title}</p>
              <p className="philosopher-tagline">{philosopher.tagline}</p>
              <span className="philosopher-era">{philosopher.era}</span>
            </button>
          )
        })}
      </div>

      <div className="mode-actions">
        <button
          type="button"
          className="primary-btn"
          disabled={selectedCount < 1}
          onClick={() => onModeChoice("perspectives")}
        >
          Get Perspectives
        </button>
        <button
          type="button"
          className="secondary-btn"
          disabled={selectedCount !== 2}
          onClick={() => onModeChoice("debate")}
        >
          Start Debate
        </button>
      </div>
    </section>
  )
}
