export default function CategoryGrid({ categories, selectedCategory, onSelect }) {
  return (
    <section className="category-grid-wrap">
      <h2 className="section-title">Choose Your Arena</h2>
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
            </button>
          )
        })}
      </div>
    </section>
  )
}
