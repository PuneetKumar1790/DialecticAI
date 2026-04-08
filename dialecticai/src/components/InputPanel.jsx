import { useEffect, useState } from "react"

const QUICK_PLACEHOLDERS = [
  "Should I quit my job and go solo?",
  "My best friend betrayed my trust...",
  "Is democracy actually broken?",
  "I don't know who I am anymore..."
]

export default function InputPanel({
  inputMode,
  setInputMode,
  quickValue,
  setQuickValue,
  deepValues,
  setDeepValues,
  onBack,
  onSubmit,
  disabled
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % QUICK_PLACEHOLDERS.length)
    }, 2400)

    return () => clearInterval(id)
  }, [])

  function updateDeepField(field, value) {
    setDeepValues(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section className="input-panel-wrap">
      <div className="section-header-row">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      <h2 className="section-title">State The Problem</h2>

      <div className="input-mode-toggle" role="tablist" aria-label="Input mode">
        <button
          type="button"
          className={inputMode === "quick" ? "active" : ""}
          onClick={() => setInputMode("quick")}
        >
          Quick
        </button>
        <button
          type="button"
          className={inputMode === "deep" ? "active" : ""}
          onClick={() => setInputMode("deep")}
        >
          Deep
        </button>
      </div>

      {inputMode === "quick" ? (
        <div className="quick-mode">
          <textarea
            value={quickValue}
            onChange={e => setQuickValue(e.target.value)}
            placeholder={QUICK_PLACEHOLDERS[placeholderIndex]}
            rows={6}
          />
        </div>
      ) : (
        <div className="deep-mode">
          <label>
            What is your situation?
            <textarea
              rows={5}
              value={deepValues.situation}
              onChange={e => updateDeepField("situation", e.target.value)}
            />
          </label>
          <label>
            What do you actually want?
            <input
              type="text"
              value={deepValues.want}
              onChange={e => updateDeepField("want", e.target.value)}
            />
          </label>
          <label>
            What are you afraid of?
            <input
              type="text"
              value={deepValues.fear}
              onChange={e => updateDeepField("fear", e.target.value)}
            />
          </label>
          <label>
            What have you already tried?
            <input
              type="text"
              value={deepValues.tried}
              onChange={e => updateDeepField("tried", e.target.value)}
            />
          </label>
        </div>
      )}

      <button
        type="button"
        className="primary-btn ask-btn"
        onClick={onSubmit}
        disabled={disabled}
      >
        Ask the Philosophers →
      </button>
    </section>
  )
}
