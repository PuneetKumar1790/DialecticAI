function DebateColumn({ philosopher, messages = [], loading }) {
  return (
    <article className="debate-column" style={{ borderTopColor: philosopher.color }}>
      <header>
        <h3>{philosopher.name}</h3>
        <span>{philosopher.title}</span>
      </header>

      <div className="debate-stream">
        {messages.length === 0 && loading ? (
          <div className="response-skeleton" />
        ) : (
          messages.map(entry => (
            <div key={`${philosopher.id}-${entry.round}`} className="debate-message">
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
  return (
    <section className="debate-arena">
      <div className="round-badge">Round {round} of {maxRound}</div>

      <div className="debate-grid">
        <DebateColumn
          philosopher={philosophers[0]}
          messages={messages[philosophers[0]?.id]}
          loading={loading}
        />
        <div className="debate-vs-divider">VS</div>
        <DebateColumn
          philosopher={philosophers[1]}
          messages={messages[philosophers[1]?.id]}
          loading={loading}
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
