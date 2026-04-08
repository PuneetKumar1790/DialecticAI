export default function SynthesisBlock({ synthesis, loading }) {
  if (!loading && !synthesis) return null

  return (
    <section className={`synthesis-block ${synthesis ? "visible" : ""}`}>
      <div className="synthesis-separator" />
      <p className="synthesis-label">SYNTHESIS</p>
      {loading ? <div className="response-skeleton" /> : <p className="synthesis-text">{synthesis}</p>}
    </section>
  )
}
