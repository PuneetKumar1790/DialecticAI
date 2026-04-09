import { useEffect, useMemo, useRef, useState } from "react"
import { ALL_QUESTIONS, CATEGORY_QUESTIONS } from "../data/questions"
import { getCategoryForQuestion, shuffleArray } from "../utils/shuffle"

const FADE_OUT_MS = 300
const FADE_GAP_MS = 100

function getSourceQuestions(categoryKey) {
  if (categoryKey && CATEGORY_QUESTIONS[categoryKey]) {
    return CATEGORY_QUESTIONS[categoryKey]
  }
  return ALL_QUESTIONS
}

function categoryLabelForQuestion(question) {
  return getCategoryForQuestion(question) || "all"
}

export default function QuestionCycler({ questions = [], interval = 4000, onSelect, categoryKey }) {
  const sourceQuestions = useMemo(() => {
    return questions.length > 0 ? questions : getSourceQuestions(categoryKey)
  }, [questions, categoryKey])

  const [queue, setQueue] = useState(() => shuffleArray(sourceQuestions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [hovered, setHovered] = useState(false)
  const timersRef = useRef({ interval: null, fadeOut: null, gap: null })

  const currentQuestion = queue[currentIndex] || sourceQuestions[0] || ""
  const currentCategory = categoryLabelForQuestion(currentQuestion)
  const categoryPill = categoryKey || currentCategory || "all"

  useEffect(() => {
    const nextQueue = shuffleArray(sourceQuestions)
    setQueue(nextQueue)
    setCurrentIndex(0)
    setVisible(true)
  }, [sourceQuestions])

  useEffect(() => {
    const clearTimers = () => {
      if (timersRef.current.interval) window.clearInterval(timersRef.current.interval)
      if (timersRef.current.fadeOut) window.clearTimeout(timersRef.current.fadeOut)
      if (timersRef.current.gap) window.clearTimeout(timersRef.current.gap)
      timersRef.current = { interval: null, fadeOut: null, gap: null }
    }

    clearTimers()

    if (hovered || queue.length <= 1) {
      return clearTimers
    }

    timersRef.current.interval = window.setInterval(() => {
      setVisible(false)

      timersRef.current.fadeOut = window.setTimeout(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + 1
          if (nextIndex >= queue.length) {
            const reshuffled = shuffleArray(sourceQuestions)
            setQueue(reshuffled)
            return 0
          }
          return nextIndex
        })

        timersRef.current.gap = window.setTimeout(() => {
          setVisible(true)
        }, FADE_GAP_MS)
      }, FADE_OUT_MS)
    }, interval)

    return clearTimers
  }, [hovered, queue, interval, sourceQuestions])

  return (
    <div
      className="question-cycler"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect?.(currentQuestion)}
      role="button"
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect?.(currentQuestion)
        }
      }}
    >
      <div className="question-cycler-label">
        {categoryKey ? `— ${categoryKey} questions —` : "— others are asking —"}
      </div>
      <div className={`question-cycler-question ${visible ? "visible" : "hidden"}`}>
        {currentQuestion}
      </div>
      <div className="question-cycler-hint">use this →</div>
      <div className="question-cycler-pill">{categoryPill}</div>
    </div>
  )
}
