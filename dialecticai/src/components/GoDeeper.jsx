import { useEffect, useMemo, useRef, useState } from "react"
import { generateChatResponse } from "../api/backend-client"
import { LOADING_LINES } from "./ResponseCard"

const PLACEHOLDER_CYCLES = {
  socrates: [
    "Ask him to question your assumptions further...",
    "Challenge his last question...",
    "Tell him what you think the answer is..."
  ],
  diogenes: [
    "Argue back. He enjoys it.",
    "Tell him what you value. He'll destroy it.",
    "Ask him what he actually recommends..."
  ],
  nietzsche: [
    "Tell him what your values actually are...",
    "Ask him about the will to power...",
    "Push back on his last point..."
  ],
  aurelius: [
    "Ask him what he would do in your position...",
    "Tell him what is outside your control...",
    "Ask about the obstacle being the way..."
  ],
  chanakya: [
    "Tell him who your opponents are...",
    "Ask him what move to make next...",
    "Describe the full situation in detail..."
  ],
  machiavelli: [
    "Tell him who holds power in your situation...",
    "Ask him whether to act now or wait...",
    "Describe your enemies..."
  ],
  beauvoir: [
    "Ask her about authenticity here...",
    "Tell her who holds power in this dynamic...",
    "Push back on her last point..."
  ],
  confucius: [
    "Ask him what duty demands here...",
    "Tell him about the relationship involved...",
    "Ask him what a person of character would do..."
  ],
  camus: [
    "Ask him how to find meaning anyway...",
    "Tell him you disagree with absurdism...",
    "Ask about Sisyphus being happy..."
  ],
  sartre: [
    "Tell him your excuse. He will reject it.",
    "Ask him what radical freedom means here...",
    "Push back on bad faith..."
  ],
  hobbes: [
    "Ask him what order looks like here...",
    "Challenge his view of human nature...",
    "Tell him the specific situation..."
  ],
  rousseau: [
    "Ask him what society corrupted here...",
    "Tell him what you naturally want...",
    "Ask about the general will..."
  ],
  kant: [
    "Ask him to apply the categorical imperative...",
    "Challenge his universal law test...",
    "Tell him the specific dilemma..."
  ],
  aristotle: [
    "Ask him what virtue looks like here...",
    "Tell him your current character habits...",
    "Ask about the golden mean..."
  ],
  mill: [
    "Ask him to calculate the outcomes...",
    "Challenge his utility calculation...",
    "Ask about higher vs lower pleasures..."
  ],
  marx: [
    "Tell him the class dynamics at play...",
    "Ask him what material conditions matter...",
    "Challenge his analysis..."
  ]
}

function getBaseId(id) {
  return id.replace(/_\w+$/, "")
}

export default function GoDeeper({
  philosopher,
  initialQuestion,
  initialResponse
}) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [trafficToast, setTrafficToast] = useState("")
  const endRef = useRef(null)

  const baseId = getBaseId(philosopher.id)
  const loadingLine = LOADING_LINES[baseId] || "Thinking..."
  const placeholderCycle = PLACEHOLDER_CYCLES[baseId] || ["Continue the conversation..."]
  const placeholderText = placeholderCycle[placeholderIndex % placeholderCycle.length]

  useEffect(() => {
    setMessages([
      { role: "user", content: initialQuestion },
      { role: "assistant", content: initialResponse }
    ])
  }, [initialQuestion, initialResponse])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isLoading, error])

  useEffect(() => {
    if (inputValue || isFocused || placeholderCycle.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholderCycle.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [inputValue, isFocused, placeholderCycle])

  useEffect(() => {
    function onRateLimit() {
      setTrafficToast("High traffic — retrying...")
      window.clearTimeout(onRateLimit.timer)
      onRateLimit.timer = window.setTimeout(() => setTrafficToast(""), 2200)
    }

    window.addEventListener("dialecticai:chat-rate-limit", onRateLimit)
    return () => window.removeEventListener("dialecticai:chat-rate-limit", onRateLimit)
  }, [])

  const trimmedMessages = useMemo(() => {
    if (messages.length > 12) {
      return [messages[0], messages[1], ...messages.slice(-10)]
    }
    return messages
  }, [messages])

  function resizeTextarea(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`
  }

  async function sendMessage() {
    const text = inputValue.trim()
    if (!text || isLoading) return

    const nextMessages = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInputValue("")
    setError(null)
    setIsLoading(true)

    try {
      const nextTrimmed = nextMessages.length > 12
        ? [nextMessages[0], nextMessages[1], ...nextMessages.slice(-10)]
        : nextMessages

      const reply = await generateChatResponse(
        philosopher.id,
        philosopher.systemPrompt,
        nextTrimmed
      )
      setMessages(prev => [...prev, {
        role: "assistant",
        content: reply || "This philosopher refused to answer."
      }])
    } catch {
      setError(`${philosopher.name} has gone silent. Try again in a moment.`)
    } finally {
      setIsLoading(false)
    }
  }

  async function retryLast() {
    setError(null)
    setIsLoading(true)

    try {
      const reply = await generateChatResponse(
        philosopher.id,
        philosopher.systemPrompt,
        trimmedMessages
      )
      setMessages(prev => [...prev, {
        role: "assistant",
        content: reply || "This philosopher refused to answer."
      }])
    } catch {
      setError(`${philosopher.name} has gone silent. Try again in a moment.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="go-deeper-chat-wrap">
      <p className="go-deeper-disclaimer">
        Speaking with {philosopher.name} as {philosopher.name === "de Beauvoir" ? "she" : "he"} would have spoken.
        Philosophical roleplay, not real advice.
      </p>

      <div className="go-deeper-messages">
        {trafficToast && <p className="go-deeper-toast">{trafficToast}</p>}

        {messages.map((message, index) => (
          message.role === "user" ? (
            <article key={`user-${index}`} className={`message-user ${index === 0 ? "message-user-initial" : ""}`}>
              {index === 0 && <p className="message-user-label">You asked:</p>}
              {message.content}
            </article>
          ) : (
            <article key={`assistant-${index}`} className="message-philosopher" style={{ borderLeftColor: philosopher.color }}>
              <p className="message-philosopher-label" style={{ color: philosopher.color }}>{philosopher.name}</p>
              <p className="message-philosopher-text">{message.content}</p>
            </article>
          )
        ))}

        {isLoading && (
          <article className="message-philosopher" style={{ borderLeftColor: philosopher.color }}>
            <p className="message-philosopher-label" style={{ color: philosopher.color }}>{philosopher.name}</p>
            <p className="message-philosopher-text loading">{loadingLine}</p>
          </article>
        )}

        {error && (
          <article className="message-philosopher" style={{ borderLeftColor: philosopher.color }}>
            <p className="message-philosopher-label" style={{ color: philosopher.color }}>{philosopher.name}</p>
            <p className="message-philosopher-text loading">{error}</p>
            <button type="button" className="secondary-btn" onClick={retryLast}>Retry</button>
          </article>
        )}

        <div ref={endRef} />
      </div>

      <div className="go-deeper-input-bar">
        <textarea
          className="go-deeper-textarea"
          value={inputValue}
          placeholder={placeholderText}
          rows={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={event => {
            setInputValue(event.target.value)
            resizeTextarea(event.target)
          }}
          onKeyDown={event => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              sendMessage()
            }
          }}
        />
        <button type="button" className="go-deeper-send" disabled={isLoading} onClick={sendMessage}>
          Send →
        </button>
      </div>
    </section>
  )
}
