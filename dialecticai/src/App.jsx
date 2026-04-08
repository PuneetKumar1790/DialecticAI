import { useEffect, useMemo, useState } from "react"
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

const MAX_ROUNDS = 5
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

  const category = useMemo(() => CATEGORIES[selectedCategoryKey], [selectedCategoryKey])
  const selectedPhilosophers = useMemo(() => {
    if (!category) return []
    return category.philosophers.filter(philosopher => selectedIds.includes(philosopher.id))
  }, [category, selectedIds])

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

  function resetOutputState() {
    setResponses({})
    setSynthesis("")
    setSynthesisLoading(false)
    setDebateRound(1)
    setDebateMessages({})
    setDebateLoading(false)
    setVerdict("")
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
    } catch {
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
      "You are a philosophical synthesizer. Your job is not to summarize what each philosopher said — the user already read that. Your job is to name the single deepest tension that only becomes visible when you hold all these perspectives at once. One tension. One insight. Two sentences maximum. First sentence names the tension. Second sentence says what that tension reveals about the question itself. The synthesis must reference the specific situation the person described, not abstract philosophical concepts. If someone's girlfriend cheated on them, the synthesis is about that betrayal specifically — not about 'the nature of relationships.' Make it land personally. No names of philosophers in the synthesis. No markdown. Be memorable."

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
    const questionText = buildQuestion()
    if (!questionText) return

    setSubmitting(true)
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

  return (
    <main className="app-shell">
      <header className="hero-header">
        <p className="eyebrow">NO LOGIN. NO CONSENSUS. JUST CLARITY.</p>
        <h1>DialecticAI</h1>
        <p className="hero-copy">
          History&apos;s sharpest philosophers dissect your modern problem. Truth appears in contradiction.
        </p>
      </header>

      {toast && <div className="toast">{toast}</div>}

      {step === "categories" && (
        <CategoryGrid
          categories={CATEGORIES}
          selectedCategory={selectedCategoryKey}
          onSelect={handleCategorySelect}
        />
      )}

      {step === "philosophers" && category && (
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
      )}

      {step === "input" && (
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
        />
      )}

      {step === "perspectives" && (
        <section className="responses-wrap">
          <div className="section-header-row">
            <button type="button" className="ghost-btn" onClick={() => setStep("input")}>
              ← Back
            </button>
          </div>

          <h2 className="section-title">Perspectives</h2>
          <p className="asked-question">{question}</p>

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
        <section>
          <div className="section-header-row">
            <button type="button" className="ghost-btn" onClick={() => setStep("input")}>
              ← Back
            </button>
          </div>

          <h2 className="section-title">Debate Arena</h2>
          <p className="asked-question">{question}</p>

          <DebateArena
            philosophers={selectedPhilosophers}
            round={debateRound}
            maxRound={MAX_ROUNDS}
            messages={debateMessages}
            loading={debateLoading}
            onNextRound={handleNextRound}
            onGetVerdict={handleGetVerdict}
            canGetVerdict={debateRound >= 3}
            verdict={verdict}
          />
        </section>
      )}

      {step === "goDeeper" && goDeeperPhilosopher && (
        <GoDeeper
          philosopher={goDeeperPhilosopher}
          initialQuestion={goDeeperInitialQuestion}
          initialResponse={goDeeperInitialResponse}
          onClose={() => setStep("perspectives")}
        />
      )}

      <DiogenesGate
        open={!!pendingDiogenes}
        onConfirm={confirmDiogenes}
        onCancel={cancelDiogenes}
      />
    </main>
  )
}
