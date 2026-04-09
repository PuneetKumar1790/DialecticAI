export default function CategoryGrid({ categories, selectedCategory, onSelect }) {
  return (
    <section className="category-grid-wrap">
      <div className="screen-heading center">
        <p className="screen-eyebrow">— what are you dealing with —</p>
        <h2 className="section-title">Choose your battlefield</h2>
        <p className="section-subtitle">Pick the category closest to your situation.</p>
      </div>

      <div className="category-grid">
        {Object.entries(categories).map(([key, category]) => {
          const selected = selectedCategory === key

          return (
            <button
              type="button"
              key={key}
              className={`category-card ${selected ? "selected" : ""}`}
              onClick={() => onSelect(key)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
              <div className="category-philosopher-row">
                {category.philosophers.map(philosopher => (
                  <span key={philosopher.id} className="category-philosopher-chip">
                    <span
                      className="category-philosopher-dot"
                      style={{ backgroundColor: philosopher.color }}
                      aria-hidden="true"
                    />
                    {philosopher.name}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
