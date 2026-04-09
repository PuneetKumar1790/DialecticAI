import { useEffect, useMemo, useRef, useState } from "react"
import { ALL_QUESTIONS, CATEGORY_QUESTIONS } from "../data/questions"
import { getRandomQuestions, shuffleArray } from "../utils/shuffle"

function getSourceQuestions(category) {
  if (category && CATEGORY_QUESTIONS[category]) {
    return CATEGORY_QUESTIONS[category]
  }
  return ALL_QUESTIONS
}

export default function SuggestedQuestions({ category, onSelect }) {
  const sourceQuestions = useMemo(() => getSourceQuestions(category), [category])
  const [questions, setQuestions] = useState(() => getRandomQuestions(sourceQuestions, 4))
  const [visible, setVisible] = useState(true)
  const [activeQuestion, setActiveQuestion] = useState("")
  const chipTimerRef = useRef(null)
  const refreshTimerRef = useRef(null)

  useEffect(() => {
    const nextQuestions = getRandomQuestions(sourceQuestions, 4)
    setQuestions(nextQuestions)
    setVisible(true)
  }, [sourceQuestions])

  useEffect(() => {
    return () => {
      window.clearTimeout(chipTimerRef.current)
      window.clearTimeout(refreshTimerRef.current)
    }
  }, [])

  function selectQuestion(question) {
    setActiveQuestion(question)
    window.clearTimeout(chipTimerRef.current)
    chipTimerRef.current = window.setTimeout(() => {
      setActiveQuestion("")
    }, 800)
    onSelect?.(question)
  }

  function refreshSuggestions() {
    setVisible(false)
    window.clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = window.setTimeout(() => {
      setQuestions(getRandomQuestions(sourceQuestions, 4))
      setVisible(true)
    }, 120)
  }

  return (
    <section className="suggested-questions-wrap">
      <p className="suggested-questions-label">suggested questions</p>
      <div className={`suggested-questions-grid ${visible ? "visible" : "hidden"}`}>
        {questions.map(question => (
          <button
            key={question}
            type="button"
            className={`suggested-question-chip ${activeQuestion === question ? "active" : ""}`}
            onClick={() => selectQuestion(question)}
          >
            {question}
          </button>
        ))}
      </div>
      <button type="button" className="suggested-questions-refresh" onClick={refreshSuggestions}>
        Refresh suggestions ↻
      </button>
    </section>
  )
}
