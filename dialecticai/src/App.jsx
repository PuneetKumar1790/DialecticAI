import { useEffect, useMemo, useRef, useState } from "react"
import CATEGORIES from "./data/philosophers"
import { generateResponse, generateChatResponse } from "./api/backend-client"
import CategoryGrid from "./components/CategoryGrid"
import PhilosopherSelect from "./components/PhilosopherSelect"
import InputPanel from "./components/InputPanel"
import DiogenesGate from "./components/DiogenesGate"
import ResponseCard from "./components/ResponseCard"
import DebateArena from "./components/DebateArena"
import SynthesisBlock from "./components/SynthesisBlock"
import GoDeeper from "./components/GoDeeper"
import FeedbackModal from "./components/FeedbackModal"

const MAX_ROUNDS = 5
const MIN_QUICK_CHARS = 20
const FEEDBACK_MODAL_DELAY_MS = 8000
const FORMAT_RULES = {
  socrates: "Respond in questions only. Zero statements.",
  diogenes: "Short sentences. Maximum 6 words each where possible. Be brutal.",
  aurelius: "Calm. Measured. No emotional language. Present tense only.",
  nietzsche: "Use at least one aphorism. Be passionate. One rhetorical question.",
  chanakya: "Think three moves ahead. Cold. Strategic. No emotion whatsoever.",
  machiavelli: "Identify who holds power first. Then advise. Be direct.",
  beauvoir: "Build your argument sentence by sentence. Analytical. No hedging.",
  confucius: "Terse. Specific. Three sentences maximum. Final sentence is a door closing.",
  camus: "Warm but unflinching. Acknowledge the absurdity first. Then the revolt.",
  sartre: "Harsh about self-deception. No excuses accepted. Radical responsibility.",
  hobbes: "Reference human nature immediately. Defend order. Be blunt.",
  rousseau: "Passionate. Find the structural cause. Never blame the individual alone.",
  kant: "Apply the categorical imperative directly to this exact situation. Be rigorous.",
  aristotle: "Ask what a virtuous person would do here. Reference character building.",
  mill: "Calculate the outcomes explicitly. Compare higher vs lower pleasures.",
  marx: "Identify class dynamics first. Who benefits. Who suffers. Be analytical."
}

export default function App() {
  const [step, setStep] = useState("categories")
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [mode, setMode] = useState("")

  const [inputMode, setInputMode] = useState("quick")
  const [quickValue, setQuickValue] = useState("")
  const [deepValues, setDeepValues] = useState({
    situation: "",
    want: "",
    fear: "",
    tried: ""
  })
  const [question, setQuestion] = useState("")

  const [responses, setResponses] = useState({})
  const [synthesis, setSynthesis] = useState("")
  const [synthesisLoading, setSynthesisLoading] = useState(false)

  const [debateRound, setDebateRound] = useState(1)
  const [debateMessages, setDebateMessages] = useState({})
  const [debateLoading, setDebateLoading] = useState(false)
  const [verdict, setVerdict] = useState("")

  const [toast, setToast] = useState("")
  const [pendingDiogenes, setPendingDiogenes] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [goDeeperPhilosopher, setGoDeeperPhilosopher] = useState(null)
  const [goDeeperInitialQuestion, setGoDeeperInitialQuestion] = useState("")
  const [goDeeperInitialResponse, setGoDeeperInitialResponse] = useState("")
  const [prefillBanner, setPrefillBanner] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [validationErrors, setValidationErrors] = useState({})

  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackEligible, setFeedbackEligible] = useState(false)
  const [feedbackAutoShown, setFeedbackAutoShown] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const feedbackModalTimerRef = useRef(null)

  const category = useMemo(() => CATEGORIES[selectedCategoryKey], [selectedCategoryKey])
  const selectedPhilosophers = useMemo(() => {
    if (!category) return []
    return category.philosophers.filter(philosopher => selectedIds.includes(philosopher.id))
  }, [category, selectedIds])

  const currentStepIndex =
    step === "categories"
      ? 0
      : step === "philosophers"
        ? 1
        : step === "input"
          ? 2
          : 3

  const responseModeLabel =
    step === "debate"
      ? "Debate"
      : step === "goDeeper"
        ? "Go Deeper"
        : "Perspectives"

  const breadcrumbSteps = [
    "Choose Category",
    "Choose Philosophers",
    "Your Question",
    responseModeLabel
  ]

  function getBaseId(id) {
    return id.replace(/_\w+$/, "")
  }

  function getSystemPromptWithFormatRule(philosopher, extraSystemLine = "") {
    const baseId = getBaseId(philosopher.id)
    const formatRule = FORMAT_RULES[baseId]
    const parts = [philosopher.systemPrompt]

    if (extraSystemLine) parts.push(extraSystemLine)
    if (formatRule) parts.push(formatRule)

    return parts.join("\n\n")
  }

  function showToast(message) {
    setToast(message)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => {
      setToast("")
    }, 2500)
  }

  function clearFeedbackModalTimer() {
    if (!feedbackModalTimerRef.current) return
    window.clearTimeout(feedbackModalTimerRef.current)
    feedbackModalTimerRef.current = null
  }

  function scheduleFeedbackModal() {
    if (feedbackAutoShown || feedbackSubmitted) return

    setFeedbackAutoShown(true)
    clearFeedbackModalTimer()

    feedbackModalTimerRef.current = window.setTimeout(() => {
      setShowFeedbackModal(true)
      feedbackModalTimerRef.current = null
    }, FEEDBACK_MODAL_DELAY_MS)
  }

  function activateFeedbackPrompt() {
    if (feedbackEligible) return
    setFeedbackEligible(true)
    scheduleFeedbackModal()
  }

  function resetOutputState() {
    clearFeedbackModalTimer()
    setResponses({})
    setSynthesis("")
    setSynthesisLoading(false)
    setDebateRound(1)
    setDebateMessages({})
    setDebateLoading(false)
    setVerdict("")
    setShowFeedbackModal(false)
    setFeedbackEligible(false)
    setFeedbackAutoShown(false)
    setFeedbackSubmitted(false)
  }

  function handleCategorySelect(key) {
    setSelectedCategoryKey(key)
    setSelectedIds([])
    setMode("")
    setQuestion("")
    resetOutputState()
    setStep("philosophers")
  }

  function togglePhilosopher(philosopher) {
    const isSelected = selectedIds.includes(philosopher.id)

    if (!isSelected && philosopher.name === "Diogenes") {
      setPendingDiogenes(philosopher)
      return
    }

    setSelectedIds(prev =>
      prev.includes(philosopher.id)
        ? prev.filter(id => id !== philosopher.id)
        : [...prev, philosopher.id]
    )
  }

  function confirmDiogenes() {
    if (!pendingDiogenes) return
    setSelectedIds(prev => [...prev, pendingDiogenes.id])
    setPendingDiogenes(null)
  }

  function cancelDiogenes() {
    setPendingDiogenes(null)
  }

  function buildQuestion() {
    if (inputMode === "quick") {
      return quickValue.trim()
    }

    return [
      `My situation: ${deepValues.situation.trim()}`,
      `What I want: ${deepValues.want.trim()}`,
      `What I fear: ${deepValues.fear.trim()}`,
      `What I have tried: ${deepValues.tried.trim()}`,
      "",
      "Respond to my specific situation above."
    ].join("\n").trim()
  }

  function validateSubmission() {
    const errors = {}

    if (inputMode === "quick") {
      const value = quickValue.trim()

      if (!value) {
        errors.quick = "Question is required."
      } else if (value.length < MIN_QUICK_CHARS) {
        errors.quick = `Question is too short. Add detail (${MIN_QUICK_CHARS}+ characters).`
      }
    } else {
      if (!deepValues.situation.trim()) errors.situation = "Situation is required."
      if (!deepValues.want.trim()) errors.want = "What you want is required."
      if (!deepValues.fear.trim()) errors.fear = "What you fear is required."
      if (!deepValues.tried.trim()) errors.tried = "What you tried is required."
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  async function askWithFallback(systemPrompt, userPrompt) {
    try {
      return await generateResponse(null, systemPrompt, userPrompt, "groq")
    } catch (error) {
      if (error?.code === "rate_limit_exceeded") {
        showToast("Retrying with fallback...")
        return generateResponse(null, systemPrompt, userPrompt, "gemini")
      }
      throw error
    }
  }

  async function requestSingleResponse(philosopher, questionText) {
    try {
      const text = await askWithFallback(
        getSystemPromptWithFormatRule(philosopher),
        questionText
      )

      setResponses(prev => ({
        ...prev,
        [philosopher.id]: {
          status: "done",
          text: text || "This philosopher refused to answer."
        }
      }))
    } catch (error) {
      if (error?.code === "too_many_requests") {
        showToast("Rate limit reached. Please wait and try again.")
      }

      setResponses(prev => ({
        ...prev,
        [philosopher.id]: {
          status: "error",
          text: ""
        }
      }))
    }
  }

  async function runSynthesis(questionText) {
    setSynthesisLoading(true)

    const synthSystem =
      "You are a synthesis engine. You have one job: find the crack in the question that only appears when contradictory perspectives collide. Rules: Two sentences. Hard limit. Sentence 1: Start with the specific situation the person described - a concrete detail from what they wrote. Not \"the question of loyalty\" - \"the fact that she stayed for two years.\" Name what is actually in tension using their words, not philosophical categories. Sentence 2: Say what that tension exposes about what the person is really asking - which is almost never what they think they're asking. Never name a philosopher. Never use the words \"tension,\" \"paradox,\" \"dichotomy,\" \"authenticity,\" \"meaning,\" or \"existence\" - these are escape hatches into abstraction. Never write a sentence that could apply to a different person's situation. No markdown. No hedging. No comfort. If someone submitted \"my girlfriend cheated on me\" - the synthesis is about that specific betrayal, that specific person, written so they feel slightly exposed reading it."

    const lines = selectedPhilosophers.map(philosopher => {
      const entry = responses[philosopher.id]
      const text = entry?.status === "done" ? entry.text : "No response."
      return `${philosopher.name}: ${text}`
    })

    const synthUser = `The person asked: "${questionText}"\n\n${lines.join("\n")}\n\nSynthesize the core tension.`

    try {
      const text = await askWithFallback(synthSystem, synthUser)
      setSynthesis(text || "The tension remains unresolved. Hold it longer.")
    } catch {
      setSynthesis("The synthesis failed to load. Hold the tension between voices and revisit.")
    } finally {
      setSynthesisLoading(false)
    }
  }

  async function runPerspectives(questionText) {
    setStep("perspectives")
    setResponses(
      selectedPhilosophers.reduce((acc, philosopher) => {
        acc[philosopher.id] = { status: "loading", text: "" }
        return acc
      }, {})
    )
    setSynthesis("")

    const tasks = selectedPhilosophers.map(async philosopher => {
      await requestSingleResponse(philosopher, questionText)
    })

    await Promise.all(tasks)
  }

  useEffect(() => {
    if (step !== "perspectives" || synthesisLoading || synthesis) return
    if (selectedPhilosophers.length === 0) return

    const allResolved = selectedPhilosophers.every(philosopher => {
      const state = responses[philosopher.id]
      return state && state.status !== "loading"
    })

    if (allResolved && question) {
      runSynthesis(question)
    }
  }, [
    responses,
    selectedPhilosophers,
    step,
    synthesis,
    synthesisLoading,
    question
  ])

  useEffect(() => {
    if (step !== "perspectives" || !synthesis) return
    activateFeedbackPrompt()
  }, [step, synthesis, feedbackEligible])

  useEffect(() => {
    if (step !== "debate" || !verdict) return
    activateFeedbackPrompt()
  }, [step, verdict, feedbackEligible])

  useEffect(() => {
    return () => clearFeedbackModalTimer()
  }, [])

  async function runDebateRound(nextRound, questionText, existingMessages) {
    setDebateLoading(true)

    const [philA, philB] = selectedPhilosophers
    const roundPhilosophers = [philA, philB]

    const tasks = roundPhilosophers.map(async philosopher => {
      const opponent = philosopher.id === philA.id ? philB : philA
      const opponentStream = existingMessages[opponent.id] || []
      const opponentLast = opponentStream[opponentStream.length - 1]?.text || ""
      const baseId = getBaseId(philosopher.id)

      const roundSpecificDirective =
        baseId === "socrates"
          ? "Never address your opponent by name mid-sentence. Never say \"you said\" or \"your claim\". Just ask the question that dismantles what they said. Let the question do the work silently."
          : baseId === "diogenes"
            ? "You do not summarize your opponent fairly. You caricature what they said, then attack the caricature. This is intentional cynicism, not bad debating."
            : ""

      const systemPrompt =
        nextRound === 1
          ? getSystemPromptWithFormatRule(
              philosopher,
              "You are giving an opening statement in a live debate. 2-3 sentences. Be direct and stake your position clearly. No markdown. Year: 2026."
            )
          : getSystemPromptWithFormatRule(
              philosopher,
              `You are in Round ${nextRound} of a live debate. Directly attack your opponent's argument. Reference what they actually said. 2-3 sentences. No markdown.${roundSpecificDirective ? ` ${roundSpecificDirective}` : ""}`
            )

      const userPrompt =
        nextRound === 1
          ? `Debate topic: "${questionText}"\nGive your opening position.`
          : `Debate topic: "${questionText}"\n\n${opponent.name} just argued:\n"${opponentLast}"\n\nDo not simply state your own position again. Find the weakest point in what your opponent just said and attack it directly. Quote or paraphrase their exact argument before dismantling it.\n\nRespond directly to their argument.`

      try {
        const text = await askWithFallback(systemPrompt, userPrompt)
        return { id: philosopher.id, text: text || "This philosopher refused to answer." }
      } catch {
        return { id: philosopher.id, text: "I withhold my speech this round." }
      }
    })

    const results = await Promise.all(tasks)

    const updated = { ...existingMessages }
    results.forEach(result => {
      const prev = updated[result.id] || []
      updated[result.id] = [...prev, { round: nextRound, text: result.text }]
    })

    setDebateMessages(updated)
    setDebateRound(nextRound)
    setDebateLoading(false)

    if (nextRound >= MAX_ROUNDS) {
      await requestVerdict(nextRound, updated, questionText)
    }
  }

  async function requestVerdict(round, messages, questionText) {
    if (verdict) return

    setDebateLoading(true)
    const [philA, philB] = selectedPhilosophers
    const finalA = messages[philA.id]?.[messages[philA.id].length - 1]?.text || "No final statement."
    const finalB = messages[philB.id]?.[messages[philB.id].length - 1]?.text || "No final statement."

    const systemPrompt =
      "You are a neutral debate judge. 2-3 sentences. No markdown. Identify the strongest point each side made and declare who made the more coherent overall argument and why."

    const userPrompt = `After ${round} rounds debating "${questionText}":\n\n${philA.name}'s final position: "${finalA}"\n${philB.name}'s final position: "${finalB}"\n\nDeliver your verdict.`

    try {
      const text = await askWithFallback(systemPrompt, userPrompt)
      setVerdict(text || "No verdict delivered.")
    } catch {
      setVerdict("The judge refused to declare a winner.")
    } finally {
      setDebateLoading(false)
    }
  }

  async function handleSubmit() {
    const validation = validateSubmission()
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      setSubmitError("Please fix the highlighted fields before submitting.")
      showToast("Submission blocked: required details are missing.")
      return
    }

    const questionText = buildQuestion()
    if (!questionText) {
      setSubmitError("Question is empty. Add your situation and try again.")
      setValidationErrors(inputMode === "quick" ? { quick: "Question is required." } : { situation: "Situation is required." })
      return
    }

    setSubmitting(true)
    setSubmitError("")
    setValidationErrors({})
    setQuestion(questionText)
    resetOutputState()

    try {
      if (mode === "debate") {
        setStep("debate")
        const initial = selectedPhilosophers.reduce((acc, philosopher) => {
          acc[philosopher.id] = []
          return acc
        }, {})
        setDebateMessages(initial)
        await runDebateRound(1, questionText, initial)
      } else {
        await runPerspectives(questionText)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRetry(philosopher) {
    if (!question) return

    setResponses(prev => ({
      ...prev,
      [philosopher.id]: { status: "loading", text: "" }
    }))

    await requestSingleResponse(philosopher, question)
  }

  async function handleNextRound() {
    if (debateLoading) return
    const nextRound = debateRound + 1
    if (nextRound > MAX_ROUNDS) return
    await runDebateRound(nextRound, question, debateMessages)
  }

  async function handleGetVerdict() {
    if (debateLoading) return
    await requestVerdict(debateRound, debateMessages, question)
  }

  function handleGoDeeper(philosopher, response) {
    setGoDeeperPhilosopher(philosopher)
    setGoDeeperInitialQuestion(question)
    setGoDeeperInitialResponse(response)
    setStep("goDeeper")
  }

  function handleGoDeeperSixMessages() {
    activateFeedbackPrompt()
  }

  function handleOpenFeedbackModal() {
    clearFeedbackModalTimer()
    setShowFeedbackModal(true)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const prefillQuestion = params.get("q")

    if (!prefillQuestion) return undefined

    let decodedQuestion = prefillQuestion
    try {
      decodedQuestion = decodeURIComponent(prefillQuestion)
    } catch {
      decodedQuestion = prefillQuestion
    }

    setQuickValue(decodedQuestion)
    setInputMode("quick")
    setStep("input")
    setPrefillBanner("Question brought from homepage")

    const timer = window.setTimeout(() => setPrefillBanner(""), 3000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!submitError && Object.keys(validationErrors).length === 0) return

    setSubmitError("")
    setValidationErrors({})
  }, [inputMode, quickValue, deepValues])

  return (
    <main className="app-shell">
      <header className="app-nav">
        {step === "goDeeper" ? (
          <div className="app-nav-inner app-nav-deeper">
            <button type="button" className="app-nav-back" onClick={() => setStep("perspectives")}>
              ← Perspectives
            </button>
            <p className="app-nav-deeper-name" style={{ color: goDeeperPhilosopher?.color }}>
              {goDeeperPhilosopher?.name}
            </p>
            <p className="app-nav-deeper-title">{goDeeperPhilosopher?.title}</p>
          </div>
        ) : (
          <div className="app-nav-inner">
            <a className="app-brand" href="/">
              DialecticAI
            </a>

            <div className="app-breadcrumb" aria-label="Progress">
              {breadcrumbSteps.map((label, index) => {
                const stateClass = index < currentStepIndex ? "completed" : index === currentStepIndex ? "current" : "upcoming"
                return (
                  <span key={label} className={`crumb ${stateClass}`}>
                    {label}
                    {index < breadcrumbSteps.length - 1 && <span className="crumb-sep"> · </span>}
                  </span>
                )
              })}
            </div>

            {(step === "perspectives" || step === "debate") && (
              <span className="mode-pill">{responseModeLabel}</span>
            )}
          </div>
        )}
      </header>

      <div className="app-content">

      {toast && <div className="toast">{toast}</div>}

      {step === "categories" && (
        <section className="screen-fade">
          <CategoryGrid
            categories={CATEGORIES}
            selectedCategory={selectedCategoryKey}
            onSelect={handleCategorySelect}
          />
        </section>
      )}

      {step === "philosophers" && category && (
        <section className="screen-fade">
          <PhilosopherSelect
            category={category}
            selectedIds={selectedIds}
            onToggle={togglePhilosopher}
            onModeChoice={nextMode => {
              setMode(nextMode)
              setStep("input")
            }}
            onBack={() => setStep("categories")}
          />
        </section>
      )}

      {step === "input" && (
        <section className="screen-fade">
          <InputPanel
            inputMode={inputMode}
            setInputMode={setInputMode}
            quickValue={quickValue}
            setQuickValue={setQuickValue}
            deepValues={deepValues}
            setDeepValues={setDeepValues}
            onBack={() => setStep("philosophers")}
            onSubmit={handleSubmit}
            disabled={submitting}
            selectedPhilosophers={selectedPhilosophers}
            categoryKey={selectedCategoryKey}
            prefillBanner={prefillBanner}
            submitError={submitError}
            validationErrors={validationErrors}
          />
        </section>
      )}

      {step === "perspectives" && (
        <section className="responses-wrap screen-fade">
          <div className="section-header-row">
            <button type="button" className="ghost-btn" onClick={() => setStep("input")}>
              ← Edit Question
            </button>
          </div>

          <h2 className="section-title">Perspectives</h2>
          <div className="question-recap-bar">
            <p className="asked-question">{question}</p>
            <div className="question-chip-row">
              {selectedPhilosophers.map(philosopher => (
                <span key={philosopher.id} className="question-chip">
                  <span className="question-chip-dot" style={{ background: philosopher.color }} aria-hidden="true" />
                  {philosopher.name}
                </span>
              ))}
            </div>
          </div>

          <div className="responses-list">
            {selectedPhilosophers.map(philosopher => (
              <ResponseCard
                key={philosopher.id}
                philosopher={philosopher}
                state={responses[philosopher.id]}
                onRetry={() => handleRetry(philosopher)}
                onGoDeeper={handleGoDeeper}
              />
            ))}
          </div>

          <SynthesisBlock synthesis={synthesis} loading={synthesisLoading} />
        </section>
      )}

      {step === "debate" && (
        <section className="screen-fade">
          <div className="section-header-row">
            <button type="button" className="ghost-btn" onClick={() => setStep("input")}>
              ← Edit Question
            </button>
          </div>

          <h2 className="section-title">Debate Arena</h2>
          <div className="question-recap-bar">
            <p className="asked-question">{question}</p>
            <div className="question-chip-row">
              {selectedPhilosophers.map(philosopher => (
                <span key={philosopher.id} className="question-chip">
                  <span className="question-chip-dot" style={{ background: philosopher.color }} aria-hidden="true" />
                  {philosopher.name}
                </span>
              ))}
            </div>
          </div>

          <DebateArena
            philosophers={selectedPhilosophers}
            round={debateRound}
            maxRound={MAX_ROUNDS}
            messages={debateMessages}
            loading={debateLoading}
            onNextRound={handleNextRound}
            onGetVerdict={handleGetVerdict}
            canGetVerdict={debateRound >= MAX_ROUNDS}
            verdict={verdict}
          />
        </section>
      )}

      {step === "goDeeper" && goDeeperPhilosopher && (
        <section className="screen-fade">
          <GoDeeper
            philosopher={goDeeperPhilosopher}
            initialQuestion={goDeeperInitialQuestion}
            initialResponse={goDeeperInitialResponse}
            onClose={() => setStep("perspectives")}
            onMessageCountChange={handleGoDeeperSixMessages}
          />
        </section>
      )}

      {feedbackEligible && !feedbackSubmitted && !showFeedbackModal && (step === "perspectives" || step === "debate" || step === "goDeeper") && (
        <div className="feedback-reopen-wrap">
          <button type="button" className="feedback-reopen-btn" onClick={handleOpenFeedbackModal}>
            Rate this answer
          </button>
        </div>
      )}

      <FeedbackModal
        isOpen={showFeedbackModal}
        selectedPhilosophers={selectedPhilosophers}
        category={category?.name || ""}
        sessionType={responseModeLabel}
        onClose={() => setShowFeedbackModal(false)}
        onSubmitted={() => setFeedbackSubmitted(true)}
      />
      </div>

      <footer className="app-footer">
        <a href="mailto:puneetk49081@gmail.com" className="app-footer-email">puneetk49081@gmail.com</a>
      </footer>

      <DiogenesGate
        open={!!pendingDiogenes}
        onConfirm={confirmDiogenes}
        onCancel={cancelDiogenes}
      />
    </main>
  )
}
