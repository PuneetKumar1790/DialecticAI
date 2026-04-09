export const LOADING_LINES = {
  socrates: "Preparing his questions...",
  diogenes: "Climbing out of his barrel...",
  nietzsche: "Hammering...",
  aurelius: "Writing in his journal...",
  chanakya: "Calculating your position...",
  machiavelli: "Assessing who holds power...",
  beauvoir: "Examining the power dynamic...",
  confucius: "Consulting the five relationships...",
  camus: "Staring at the absurd...",
  sartre: "Refusing your excuses...",
  hobbes: "Defending civilization...",
  rousseau: "Blaming society...",
  kant: "Testing your maxim...",
  aristotle: "Observing your character...",
  mill: "Running the numbers...",
  marx: "Identifying the class dynamics..."
}

const LENS_LABELS = {
  socrates: "via questioning",
  diogenes: "via rejection",
  nietzsche: "via will to power",
  aurelius: "via stoic discipline",
  chanakya: "via strategic realism",
  machiavelli: "via power analysis",
  beauvoir: "via existential freedom",
  confucius: "via relational duty",
  camus: "via absurdist revolt",
  sartre: "via radical responsibility",
  hobbes: "via social order",
  rousseau: "via natural goodness",
  kant: "via universal law",
  aristotle: "via virtue ethics",
  mill: "via greatest good",
  marx: "via class analysis"
}

function getBaseId(id) {
  return id.replace(/_\w+$/, "")
}

export default function ResponseCard({
  philosopher,
  state,
  onRetry,
  onGoDeeper
}) {
  const isLoading = state?.status === "loading"
  const isError = state?.status === "error"
  const response = state?.text || ""
  const baseId = getBaseId(philosopher.id)
  const loadingLine = LOADING_LINES[baseId] || "Thinking..."
  const lensLabel = LENS_LABELS[baseId] || "via analysis"

  return (
    <article className={`response-card ${state?.status === "done" ? "loaded" : ""}`}>
      <header className="response-card-header" style={{ borderLeftColor: philosopher.color }}>
        <div className="response-head-left">
          <span className="response-head-dot" style={{ background: philosopher.color }} aria-hidden="true" />
          <div>
            <h3>{philosopher.name}</h3>
            <span>{philosopher.title}</span>
          </div>
        </div>
        <p className="lens-label" style={{ color: philosopher.color }}>
          {lensLabel}
        </p>
      </header>

      <div className="response-card-body">
        {isLoading && (
          <div className="response-skeleton-wrap">
            <div className="response-skeleton" aria-label="Loading response" />
            <p className="response-loading-line">{loadingLine}</p>
          </div>
        )}

        {isError && (
          <div className="response-error">
            <p>The philosopher could not answer right now.</p>
            <button type="button" className="secondary-btn" onClick={onRetry}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <p className="response-text">
              {response || "This philosopher refused to answer."}
            </p>
            {response && onGoDeeper && (
              <button
                type="button"
                className="go-deeper-btn"
                style={{ color: philosopher.color }}
                onClick={() => onGoDeeper(philosopher, response)}
              >
                Go Deeper with {philosopher.name} →
              </button>
            )}
          </>
        )}
      </div>
    </article>
  )
}
