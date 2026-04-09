import { QUESTION_BANK } from "../data/questions"

export function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomQuestions(arr, count) {
  return shuffleArray(arr).slice(0, count)
}

export function getCategoryForQuestion(question) {
  for (const [cat, questions] of Object.entries(QUESTION_BANK)) {
    if (questions.includes(question)) return cat
  }
  return null
}
