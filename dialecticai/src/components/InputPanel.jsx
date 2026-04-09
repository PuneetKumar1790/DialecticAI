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
  prefillBanner,
  submitError,
  validationErrors = {}
}) {
  const quickTextareaRef = useRef(null)
  const deepSituationRef = useRef(null)

  const questionSource = categoryKey && CATEGORY_QUESTIONS[categoryKey]
    ? CATEGORY_QUESTIONS[categoryKey]
    : ALL_QUESTIONS

  const hasQuickInput = quickValue.trim().length > 0
  const hasDeepInput =
    deepValues.situation.trim().length > 0 &&
    deepValues.want.trim().length > 0 &&
    deepValues.fear.trim().length > 0 &&
    deepValues.tried.trim().length > 0
  const canSubmit = inputMode === "quick" ? hasQuickInput : hasDeepInput

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

      {submitError && (
        <div className="submit-error" role="alert" aria-live="assertive">
          {submitError}
        </div>
      )}

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
            className={validationErrors.quick ? "input-invalid" : ""}
            aria-invalid={validationErrors.quick ? "true" : "false"}
            aria-describedby={validationErrors.quick ? "quick-error" : undefined}
          />

          {validationErrors.quick && (
            <p id="quick-error" className="field-error" role="alert">
              {validationErrors.quick}
            </p>
          )}

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
              className={validationErrors.situation ? "input-invalid" : ""}
              aria-invalid={validationErrors.situation ? "true" : "false"}
            />
            {validationErrors.situation && <p className="field-error">{validationErrors.situation}</p>}
          </label>
          <label>
            What do you actually want?
            <input
              type="text"
              value={deepValues.want}
              onChange={e => updateDeepField("want", e.target.value)}
              className={validationErrors.want ? "input-invalid" : ""}
              aria-invalid={validationErrors.want ? "true" : "false"}
            />
            {validationErrors.want && <p className="field-error">{validationErrors.want}</p>}
          </label>
          <label>
            What are you afraid of?
            <input
              type="text"
              value={deepValues.fear}
              onChange={e => updateDeepField("fear", e.target.value)}
              className={validationErrors.fear ? "input-invalid" : ""}
              aria-invalid={validationErrors.fear ? "true" : "false"}
            />
            {validationErrors.fear && <p className="field-error">{validationErrors.fear}</p>}
          </label>
          <label>
            What have you already tried?
            <input
              type="text"
              value={deepValues.tried}
              onChange={e => updateDeepField("tried", e.target.value)}
              className={validationErrors.tried ? "input-invalid" : ""}
              aria-invalid={validationErrors.tried ? "true" : "false"}
            />
            {validationErrors.tried && <p className="field-error">{validationErrors.tried}</p>}
          </label>
        </div>
      )}

      <button
        type="button"
        className="primary-btn ask-btn"
        onClick={onSubmit}
        disabled={disabled || !canSubmit}
      >
        Ask the Philosophers →
      </button>

      <p className="ask-note">
        {selectedPhilosophers.length} philosophers will respond simultaneously
      </p>
    </section>
  )
}
