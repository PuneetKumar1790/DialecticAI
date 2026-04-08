export default function DiogenesGate({ open, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="diogenes-overlay" role="dialog" aria-modal="true">
      <div className="diogenes-card">
        <h3>A word before you proceed</h3>
        <p>
          Diogenes has no filter. He mocked Alexander the Great to his face,
          lived in a barrel, and called civilization an embarrassing
          performance. He will be brutally honest about your situation.
          Historically accurate. Potentially offensive.
        </p>
        <div className="diogenes-actions">
          <button type="button" className="primary-btn" onClick={onConfirm}>
            I can handle it
          </button>
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Maybe not today
          </button>
        </div>
      </div>
    </div>
  )
}
