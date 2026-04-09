import { useRef } from "react"
import { ALL_QUESTIONS, CATEGORY_QUESTIONS } from "../data/questions"
import QuestionCycler from "./QuestionCycler"
import SuggestedQuestions from "./SuggestedQuestions"

export default function InputPanel({
  inputMode,
  setInputMode,
  quickValue,
  setQuickValue,
  deepValues,
  setDeepValues,
  onBack,
  onSubmit,
  disabled,
  selectedPhilosophers,
  categoryKey,
  prefillBanner
}) {
  const quickTextareaRef = useRef(null)
  const deepSituationRef = useRef(null)

  const questionSource = categoryKey && CATEGORY_QUESTIONS[categoryKey]
    ? CATEGORY_QUESTIONS[categoryKey]
    : ALL_QUESTIONS

  function updateDeepField(field, value) {
    setDeepValues(prev => ({ ...prev, [field]: value }))
  }

  function focusTextarea(ref) {
    window.requestAnimationFrame(() => {
      ref.current?.focus()
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }

  function applyQuickQuestion(question) {
    setQuickValue(question)
    focusTextarea(quickTextareaRef)
  }

  function applyDeepQuestion(question) {
    updateDeepField("situation", question)
    focusTextarea(deepSituationRef)
  }

  function handleQuestionPick(question) {
    if (inputMode === "deep") {
      applyDeepQuestion(question)
      return
    }

    applyQuickQuestion(question)
  }

  return (
    <section className="input-panel-wrap">
      {prefillBanner && <p className="prefill-banner">{prefillBanner}</p>}

      <div className="section-header-row">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Philosophers
        </button>
      </div>

      <div className="screen-heading center">
        <p className="screen-eyebrow">— your situation —</p>
        <h2 className="section-title">What are you dealing with?</h2>
        <p className="section-subtitle">
          Be specific. The more real it is, the sharper the response.
        </p>
      </div>

      <div className="asking-strip">
        <span className="asking-label">Asking:</span>
        <div className="asking-chip-wrap">
          {selectedPhilosophers.map(philosopher => (
            <span key={philosopher.id} className="asking-chip">
              <span className="asking-dot" style={{ background: philosopher.color }} aria-hidden="true" />
              {philosopher.name}
            </span>
          ))}
        </div>
      </div>

      <div className="input-mode-toggle" role="tablist" aria-label="Input mode">
        <button
          type="button"
          className={inputMode === "quick" ? "active" : ""}
          onClick={() => setInputMode("quick")}
        >
          <span>Quick</span>
          <small>one question</small>
        </button>
        <button
          type="button"
          className={inputMode === "deep" ? "active" : ""}
          onClick={() => setInputMode("deep")}
        >
          <span>Deep</span>
          <small>full context</small>
        </button>
      </div>

      {inputMode === "quick" ? (
        <div className="quick-mode">
          <QuestionCycler
            questions={questionSource}
            interval={4000}
            onSelect={applyQuickQuestion}
            categoryKey={categoryKey}
          />

          <div className="question-divider" aria-hidden="true">
            <span>or write your own</span>
          </div>

          <textarea
            ref={quickTextareaRef}
            value={quickValue}
            onChange={e => setQuickValue(e.target.value)}
            placeholder="Write your question here..."
            rows={6}
          />

          {quickValue.trim() && (
            <p className="character-count">{quickValue.trim().length} characters</p>
          )}

          <SuggestedQuestions category={categoryKey} onSelect={handleQuestionPick} />
        </div>
      ) : (
        <div className="deep-mode">
          <p className="deep-suggestions-label">suggested situations ↓</p>
          <SuggestedQuestions category={categoryKey} onSelect={handleQuestionPick} />

          <label>
            What is your situation?
            <textarea
              ref={deepSituationRef}
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

      <p className="ask-note">
        {selectedPhilosophers.length} philosophers will respond simultaneously
      </p>
    </section>
  )
}
