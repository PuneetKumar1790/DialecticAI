# 🏛 DialecticAI

## *Where Ancient Wisdom Meets Modern Dilemmas*

> "The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time and still retain the ability to function." — F. Scott Fitzgerald

**DialecticAI** is an intellectual reasoning engine disguised as an app. No algorithms. No consensus cheerleading. Instead: *real philosophers* arguing *your* problems across time, ideology, and temperament.

Select a life category. Pick your thinkers. Pose your actual dilemma. Watch Socrates interrogate your assumptions while Nietzsche dismantles your comfort. Machiavelli measures power. Confucius invokes duty. The contradiction isn't a bug—it's the entire point.

**Clarity doesn't come from answers. It comes from tension.**

---


Most tools flatten thought. This one multiplies it.

Built with **React** & **Vite** for the frontend, backed by **Groq LLM** (with **Gemini** fallback). The architecture respects your privacy: API keys live secure in the backend. What you ask stays yours.

---

## 🎯 What You Get

**📚 Philosophical Categories**
- **Career & Ambition** ⚔️ — Machiavelli vs Nietzsche. Power vs Creation.
- **Relationships & People** ⚖️ — Socrates questions. Diogenes ridicules. de Beauvoir exposes dynamics.
- **Society & Politics** 🏛️ — Hobbes defends order. Rousseau attacks it. Chanakya reads the real game.
- **Existence & Identity** ∞ — Sartre's radical freedom. Camus's absurd revolt. Nietzsche's hammer.
- **Morality & Ethics** ⚔️ — Kant's categorical imperative vs Mill's utilitarian calculus.
- **Money & Power** ♟️ — Marx unveils class. Machiavelli shows the real rules.

**🎭 Three Modes of Engagement**
1. **Perspectives** — Ask once. Get parallel responses from 4 philosophers. Watch them disagree.
2. **Debate Arena** — Pick two minds. Watch them argue *your* problem across 5 rounds. A judge renders verdict.
3. **Go Deeper** — Continue a one-on-one conversation with a single philosopher. Push back. Make them clarify.

**🔐 Privacy-First Design**
- Zero login required
- Zero data collection
- Your questions never leave your device until sent to your chosen backend

**✍️ Philosopher-Specific Voice**
Each thinker has their own format rules:
- Socrates asks questions only. No comfort.
- Diogenes speaks in brutal 5-word sentences. References historical cynicism.
- Kant applies categorical imperative directly.
- Confucius speaks in exactly 3 sentences. The last closes a door.
- Nietzsche delivers aphorisms. Poetic provocation.

**💬 Real-Time Synthesis**

## ⚙️ Technical Architecture

### Frontend 💻
- **React 18** — Component-based philosophical UI
- **Vite** — Fast bundling & hot reload for rapid iteration
- **Backend API Client** — All API calls route through secure backend

### Backend 🔒
- **Node.js + Express** — Lightweight. Fast. Secure.
- **Groq API** (primary) — Fast LLM inference for philosopher responses
### Why This Stack?
- **Speed**: Vite builds in <1s. Groq responds in <3s.
- **Privacy**: Backend isolation means your questions + queries stay protected.
- **Philosophy**: Simple tools. No unnecessary abstractions. Respect the user's intelligence.

---

## 🤔 Why This Exists

**Most tools make you dumber. They flatten choices into binary paths: this *or* that. Good *or* bad. Successful *or* failed.**

DialecticAI does the opposite. It's built on a single conviction: **Clarity comes from contradiction, not consensus.**

### The Core Insight
Real philosophy has never been about being right. It's been about *seeing deeper*. Socrates didn't answer questions—he exposed what you *don't* understand. Nietzsche didn't give comfort—he asked if you're living *your* life or someone else's. de Beauvoir didn't tell you what to do—she revealed the invisible power dynamics you're missing.

When you face a real dilemma:
- A self-help book will tell you *what to think*
- An AI chatbot will tell you *what to do*  
- DialecticAI will make you ask: **What do I actually believe? What am I afraid of? What am I avoiding?**

### Personal Context
I built this because I wanted a tool that respected my intelligence. One that didn't reduce philosophy to motivational quotes. One that let me argue with history's sharpest minds about *my actual problems*—not hypothetical ones.

The app is brutalist on purpose. Dark. Undistracting. Because when Socrates questions you, you need to feel the weight of that question. When Machiavelli analyzes power in your situation, you need to be uncomfortable. That discomfort is the beginning of real thinking.

---

## 📂 Project Structure

```
DialecticAI/
├── dialecticai/              # 🎨 Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx          # Main driver. Routes between steps.
│   │   ├── api/
│   │   │   ├── backend-client.js  # 🔐 Secure API calls to backend
│   │   │   ├── groq.js      # (deprecated - use backend)
│   │   │   └── gemini.js    # (deprecated - use backend)
│   │   ├── components/      # React components for each UI section
│   │   ├── data/
│   │   │   └── philosophers.js  # The entire philosopher database (16 minds)
│   │   └── styles/          # Black + cream brutalist aesthetics
│   ├── .env                 # Frontend env (NO SECRETS)
│   └── package.json
## 🧠 The Sixteen Minds

This project features 16 philosophers across 6 life domains. Each one has a distinct voice, methodology, and philosophical lens:

| Era | Thinker | Approach | Strength |
|-----|---------|----------|----------|
| 470 BCE | **Socrates** | Questioning | Exposes hidden assumptions |
| 412 BCE | **Diogenes** | Cynicism | Cuts through pretense |
| 1469 | **Machiavelli** | Power analysis | Reveals real motivations |
| 350 BCE | **Chanakya** | Strategic calculation | Maps long-game moves |
| 121 AD | **Marcus Aurelius** | Stoic discipline | Clarifies control vs. chaos |
| 1588 | **Hobbes** | Order-first thinking | Defends structure |
| 1712 | **Rousseau** | Passionate critique | Reveals structural injustice |
| 1724 | **Kant** | Categorical imperative | Tests universal principles |
| 1806 | **J.S. Mill** | Utilitarian calculus | Weighs outcomes precisely |
| 1818 | **Marx** | Class-lens analysis | Unmasks power structures |
| 1844 | **Nietzsche** | Will to power | Challenges comfortable lies |
| 1905 | **Sartre** | Radical freedom | Refuses your excuses |
| 1908 | **Simone de Beauvoir** | Gender + power | Exposes invisible dynamics |
| 1913 | **Camus** | Absurd revolt | Embraces meaninglessness anyway |
| 384 BCE | **Aristotle** | Virtue ethics | Builds character daily |
| 551 BCE | **Confucius** | Relational duty | Clarifies obligations |

Each philosopher is not a caricature. They're rigorous. They respond to *your actual situation*, not abstract problems. Socrates won't just ask questions—he'll ask questions *that hurt*. Kant won't just mention the categorical imperative—he'll apply it *to your exact dilemma*. That's the entire promise.

---

## 🎓 The Philosophy Behind the Project

This is built on three convictions:

### 1. **Contradiction is Clarity**
The best insight never comes from one view. It comes from holding two opposite views simultaneously. Machiavelli and Kant disagree on everything. That disagreement is where you learn what you actually value.

### 2. **Philosophy is Alive**
Philosophy isn't dead. It's not for classrooms. It's for:
- Deciding whether to leave your job
- Understanding why a friendship betrayed you
- Figuring out if you believe what you think you believe

Socrates was literally prosecuted for philosophizing in the marketplace. This app brings that back.

### 3. **You're Smarter Than You Think**
Most AI tools dumb you down with cheerful platitudes. DialecticAI assumes you can handle real contradiction, real depth, real discomfort. It treats you like an adult who wants to think—not feel good.

---

## ✍️ Colophon

Built with intelligence. Deployed with security. Used by people who read philosophy not because it's trendy, but because it works.

- If you understand why contradiction matters → you'll get this project.
- If you've read at least one *actual* philosophy book → you'll appreciate the depth.
- If you ask real questions about real problems → this tool is for you.

**One last thought:** The best kind of intelligence is intellectual humility—knowing that you don't know. Every philosopher in this app disagrees with the others. None are right. All are useful. That's philosophy.

│
└── backend/                 # 🔒 Backend (Node.js + Express)
    ├── server.js            # Express server setup
    ├── api/
    │   ├── groq.js         # Groq API wrapper
    │   └── gemini.js       # Gemini API wrapper
    ├── routes/
    │   ├── philosophers.js  # GET /api/philosophers/*
    │   ├── response.js      # POST /api/response/generate
    │   └── health.js        # GET /api/health
    ├── data/
    │   └── philosophers.js  # Philosopher database (shared)
    ├── .env                 # Backend env (HAS SECRETS - never commit)
    └── package.json
```

---

## 🚀 Quick Start

### Local Development (Both Frontend + Backend)

#### **Terminal 1: Backend**
```bash
cd /workspaces/DialecticAI/backend
npm install
# Update .env with your API keys
npm run dev
# Runs on http://localhost:5000
```

#### **Terminal 2: Frontend**
```bash
cd /workspaces/DialecticAI/dialecticai
npm install
# .env should have: VITE_BACKEND_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables

**Backend `.env` (KEEP PRIVATE — NEVER COMMIT)**
```env
PORT=5000
GROQ_API_KEY=sk_...
GEMINI_API_KEY=gm_...
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env` (safe to commit — no secrets)**
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push to GitHub (`.env` should be in `.gitignore`)
2. Go to [render.com](https://render.com)
3. Create **New Web Service**
   - Connect GitHub repo
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables:
     - `GROQ_API_KEY`
     - `GEMINI_API_KEY`
     - `FRONTEND_URL` (your deployed frontend URL)

### Deploy Frontend to Vercel / Netlify / Render

1. Build: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variable:
   - `VITE_BACKEND_URL=https://your-backend.onrender.com/api`

---

## 🔐 Security Notes

✅ **What This Project Does Right:**
- API keys stay in backend `.env`, never exposed to frontend
- Frontend only knows the backend URL
- All sensitive API calls happen server-side
- `.env` files are in `.gitignore` (never committed)

⚠️ **What You Must Do:**
1. **Never put API keys in frontend `.env`**
2. **Never commit `.env` files to Git**
3. If keys are exposed:
   - Immediately revoke them (console.groq.com, aistudio.google.com)
   - Generate new keys
   - Update backend `.env`
   - Update Render environment variables

See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for detailed security practices.

---

## 🔧 Development

If you change source files while `npm run dev` is running, Vite hot-reloads the app automatically. Restart the dev server only if dependencies or environment configuration change.

## License

No license has been specified yet.