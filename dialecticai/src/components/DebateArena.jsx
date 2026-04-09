import { LOADING_LINES } from "./ResponseCard"

function getBaseId(id) {
  return id.replace(/_\w+$/, "")
}

function DebateColumn({ philosopher, messages = [], loading, currentRound }) {
  const baseId = getBaseId(philosopher.id)
  const loadingLine = LOADING_LINES[baseId] || "Thinking..."

  return (
    <article className="debate-column" style={{ borderTopColor: philosopher.color }}>
      <header>
        <h3>{philosopher.name}</h3>
        <span>{philosopher.title}</span>
      </header>

      <div className="debate-stream">
        {messages.length === 0 && loading ? (
          <div className="debate-loading-wrap">
            <div className="response-skeleton" />
            <p className="response-loading-line">{loadingLine}</p>
          </div>
        ) : (
          messages.map(entry => (
            <div
              key={`${philosopher.id}-${entry.round}`}
              className={`debate-message ${entry.round === currentRound ? "current" : "past"}`}
              style={{ opacity: entry.round === currentRound ? 1 : Math.max(0.5, 1 - (currentRound - entry.round) * 0.12) }}
            >
              <p className="debate-round-tag">Round {entry.round}</p>
              <p>{entry.text}</p>
            </div>
          ))
        )}
      </div>
    </article>
  )
}

export default function DebateArena({
  philosophers,
  round,
  maxRound,
  messages,
  loading,
  onNextRound,
  onGetVerdict,
  canGetVerdict,
  verdict
}) {
  const [philA, philB] = philosophers

  return (
    <section className="debate-arena">
      <div className="round-badge">Round {round} of {maxRound}</div>
      <div className="round-dots" aria-hidden="true">
        {Array.from({ length: maxRound }).map((_, index) => {
          const dotRound = index + 1
          const state = dotRound < round ? "done" : dotRound === round ? "current" : "future"
          return <span key={dotRound} className={`round-dot ${state}`} />
        })}
      </div>

      <div className="debate-versus-head">
        <span className="debate-phil-a" style={{ color: philA?.color }}>{philA?.name}</span>
        <span className="debate-vs">VS</span>
        <span className="debate-phil-b" style={{ color: philB?.color }}>{philB?.name}</span>
      </div>

      <div className="debate-grid">
        <DebateColumn
          philosopher={philA}
          messages={messages[philA?.id]}
          loading={loading}
          currentRound={round}
        />
        <div className="debate-vs-divider">VS</div>
        <DebateColumn
          philosopher={philB}
          messages={messages[philB?.id]}
          loading={loading}
          currentRound={round}
        />
      </div>

      <div className="debate-actions">
        {round < maxRound && (
          <button type="button" className="primary-btn" disabled={loading} onClick={onNextRound}>
            Next Round →
          </button>
        )}

        {canGetVerdict && (
          <button type="button" className="secondary-btn" disabled={loading || !!verdict} onClick={onGetVerdict}>
            Get Verdict
          </button>
        )}
      </div>

      {verdict && (
        <article className="verdict-block">
          <p className="synthesis-label">VERDICT</p>
          <p className="synthesis-text">{verdict}</p>
        </article>
      )}
    </section>
  )
}
