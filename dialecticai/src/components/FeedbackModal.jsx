import { useState } from "react"
import { supabase } from "../supabase"
import "./FeedbackModal.css"

export default function FeedbackModal({
  isOpen,
  selectedPhilosophers,
  category,
  sessionType,
  onClose
}) {
  const [starRating, setStarRating] = useState(0)
  const [comment, setComment] = useState("")
  const [wouldRecommend, setWouldRecommend] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const philosopherNames = selectedPhilosophers.map(p => p.name)

  async function handleSubmit() {
    if (starRating === 0 || wouldRecommend === null) {
      setError("Please complete all fields before submitting.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const { error: insertError } = await supabase.from("feedback").insert([
        {
          star_rating: starRating,
          comment: comment.trim() || null,
          philosophers: philosopherNames,
          would_recommend: wouldRecommend === "yes",
          category: category || null,
          session_type: sessionType || null
        }
      ])

      if (insertError) {
        console.error("Supabase insert error:", insertError)
        setError("Couldn't save. Try again?")
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setTimeout(onClose, 1800)
    } catch (err) {
      console.error("Feedback submission error:", err)
      setError("Couldn't save. Try again?")
      setSubmitting(false)
    }
  }

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-card" onClick={e => e.stopPropagation()}>
        <button type="button" className="feedback-modal-close" onClick={onClose} aria-label="Close feedback">
          ✕
        </button>

        {!submitted ? (
          <>
            <h3 className="feedback-modal-heading">Was this useful?</h3>
            <p className="feedback-modal-subtext">Takes 20 seconds. Helps me improve.</p>

            {/* Star Rating */}
            <div className="feedback-stars-container">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`feedback-star ${starRating >= star ? "filled" : ""}`}
                  onClick={() => setStarRating(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Comment Textarea */}
            <div className="feedback-textarea-container">
              <textarea
                placeholder="What would make this sharper?"
                value={comment}
                onChange={e => setComment(e.slice(0, 300))}
                className="feedback-textarea"
                maxLength={300}
              />
              <div className="feedback-char-count">
                {comment.length}/300
              </div>
            </div>

            {/* Philosopher Chips */}
            {philosopherNames.length > 0 && (
              <div className="feedback-chips-section">
                <p className="feedback-chips-label">You consulted:</p>
                <div className="feedback-chips-container">
                  {selectedPhilosophers.map(philosopher => (
                    <span
                      key={philosopher.id}
                      className="feedback-chip"
                      style={{ borderLeftColor: philosopher.color }}
                    >
                      {philosopher.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Would Recommend */}
            <div className="feedback-recommend-group">
              <button
                type="button"
                className={`feedback-recommend-btn ${wouldRecommend === "yes" ? "selected" : ""}`}
                onClick={() => setWouldRecommend("yes")}
              >
                Yes, I'd share this
              </button>
              <button
                type="button"
                className={`feedback-recommend-btn ${wouldRecommend === "no" ? "selected" : ""}`}
                onClick={() => setWouldRecommend("no")}
              >
                Not yet
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="feedback-error">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              className="feedback-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit feedback"}
            </button>
          </>
        ) : (
          <div className="feedback-thank-you">
            <p>Noted. Thank you.</p>
          </div>
        )}
      </div>
    </div>
  )
}
