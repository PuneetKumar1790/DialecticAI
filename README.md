# 🧠 DialecticAI

Clarity doesn't come from answers. It comes from collision.

DialecticAI is a philosophical reasoning tool where your ideas don't get validated-they get challenged.

You bring a real problem.
Multiple philosophers respond.
They disagree on purpose.

And somewhere in that conflict, you see what you actually think.

## ⚔️ What it does

- Pick a life category (career, relationships, ethics, etc.)
- Choose philosophers
- Ask your real question
- Get conflicting perspectives, not a single answer

No forced consensus. No motivational fluff.

## 🧩 Core Features

- 🧠 Perspectives Mode - parallel responses from multiple philosophers
- ⚖️ Debate Mode - structured argument between thinkers (multi-round)
- 🔍 Go Deeper - continue with one philosopher
- 🎭 Distinct Voices - each thinker follows strict style + reasoning rules
- ⚠️ Diogenes Warning Gate - some perspectives are intentionally uncomfortable

## 🏛️ Philosophers Included

You're not talking to "AI personalities". These are modeled lenses:

- Socrates -> questions everything
- Nietzsche -> destroys comfort
- Machiavelli -> reads power
- Kant -> tests moral consistency
- Camus -> accepts absurdity
- Simone de Beauvoir -> exposes hidden dynamics

...and more.

They don't agree. That's the point.

## ⚙️ Tech Stack

- React + Vite
- Plain CSS
- Groq API (primary)
- Gemini (fallback)

No database. No auth. No tracking.

## 🧭 Why this exists

Most tools try to give you answers quickly.

This one slows you down.

Because real thinking starts when:

- you see contradictions
- your assumptions get exposed
- you stop looking for comfort

Built because shallow answers weren't enough.

## 📂 Project Structure

```text
dialecticai/
├── frontend/        # React + Vite
├── backend/         # Node.js + Express
└── shared/          # philosopher data
```

## 🚀 Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd dialecticai
npm install
npm run dev
```

## 🔐 Environment

### Backend (.env)

```env
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

## 📝 Notes

- No user data is stored
- API calls handled server-side
- Rate limits handled with fallback
- Designed to feel minimal, not "feature-heavy"

## 📜 License

Not decided yet.

## 🧍 Final Thought

You don't need better answers.
You need better questions.
