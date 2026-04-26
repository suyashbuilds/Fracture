# Fracture ✦
### The Algorithmic Intelligence Platform

> Break your algorithm here. Before the interviewer does. Before production does.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## What is Fracture?

Fracture is a full-stack SaaS platform that stress-tests algorithms in real time. It is not a chatbot for code. It is a **deterministic execution environment** that measures what actually matters — real execution data, not an LLM's guess.

Paste your code. Run it. Fracture will tell you exactly how it scales, where it breaks, and how to make it faster.

---

## Features

### Run Code
Execute Python code live in the browser using the Monaco Editor — the same editor that powers VS Code. Backed by Judge0's public execution API for real sandboxed execution.

### Analyze Complexity
Fracture runs your algorithm against 8 exponentially scaled input sizes (10 → 50,000) and plots the execution time curve using Recharts. It then fits the curve to detect whether your algorithm is O(1), O(log n), O(n), O(n log n), O(n²), or O(2^n).

### Break It
An adversarial AI engine powered by Groq (LLaMA 3.3 70B) that generates 5 targeted edge cases designed to expose bugs, trigger worst-case complexity, or crash your algorithm. Each case is immediately executable inside the sandbox.

### Optimize → C++
Translates your Python code into high-performance C++ using the same Groq LLM, with a side-by-side Monaco diff view, an explanation of the optimizations made, and an estimated speedup multiplier.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Charts | Recharts |
| Code Execution | Judge0 CE (public instance) |
| AI Engine | Groq API — LLaMA 3.3 70B Versatile |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/suyashbuilds/Fracture.git
cd Fracture

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the project root:

```dotenv
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at [console.groq.com](https://console.groq.com) — no credit card required.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
fracture/
├── src/
│   └── app/
│       ├── page.tsx              # Landing page
│       ├── sandbox/
│       │   └── page.tsx          # Main sandbox UI
│       └── api/
│           ├── execute/
│           │   └── route.ts      # Code execution via Judge0
│           ├── telemetry/
│           │   └── route.ts      # Complexity curve engine
│           ├── breaker/
│           │   └── route.ts      # Adversarial AI via Groq
│           └── optimize/
│               └── route.ts      # Cross-language optimizer via Groq
├── vercel.json                   # Vercel function config
├── .env.local                    # Environment variables (not committed)
└── README.md
```

---

## API Routes

### `POST /api/execute`
Executes code via Judge0 and returns stdout, stderr, and execution time.

```json
// Request
{ "code": "print('hello')", "language": "python" }

// Response
{ "output": "hello", "stderr": "", "executionTime": 42 }
```

### `POST /api/telemetry`
Runs the code 8 times against scaled input sizes and fits the complexity curve.

```json
// Request
{ "code": "...", "language": "python" }

// Response
{
  "dataPoints": [{ "n": 100, "ms": 12 }, ...],
  "complexityClass": "O(n²)"
}
```

### `POST /api/breaker`
Generates 5 adversarial edge cases using Groq LLaMA.

```json
// Request
{ "code": "..." }

// Response
{
  "cases": [
    { "name": "Empty Input", "input": "[]", "reason": "Tests null handling" },
    ...
  ]
}
```

### `POST /api/optimize`
Translates Python to optimized C++ using Groq LLaMA.

```json
// Request
{ "code": "..." }

// Response
{
  "optimizedCode": "#include <iostream>...",
  "explanation": "Used unordered_set for O(1) lookups...",
  "estimatedSpeedup": "~40x"
}
```

---

## Deployment

Fracture is deployed on Vercel with automatic CI/CD via GitHub.

Every push to `main` triggers an automatic redeployment.

To deploy your own instance:

1. Fork this repository
2. Import it on [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` in Vercel → Settings → Environment Variables
4. Deploy

---

## Roadmap

- [x] Phase 1 — Monaco Editor sandbox with live execution
- [x] Phase 2 — Backend execution API via Judge0
- [x] Phase 3 — Complexity telemetry engine + Recharts curve
- [x] Phase 4 — AI Breaker + Cross-language Optimizer
- [ ] Phase 5 — Auth + User Accounts (Clerk)
- [ ] Phase 6 — Performance Vault (run history per user)
- [ ] Phase 7 — Analytics Dashboard
- [ ] Phase 8 — GitHub Actions CI/CD Regression Guard
- [ ] Phase 9 — Freemium + Paid Tiers (Stripe)

---

## Why Fracture?

No existing tool delivers more than two of these six capabilities together:

| Tool | Telemetry | Adversarial Gen | Cross-Lang Opt | Perf History | CI/CD Guard |
|---|---|---|---|---|---|
| **Fracture ✦** | ✅ | ✅ | ✅ | Soon | Soon |
| LeetCode | Partial | ❌ | ❌ | Partial | ❌ |
| ChatGPT / Copilot | ❌ | Partial | Partial | ❌ | ❌ |
| Godbolt | ❌ | ❌ | Partial | ❌ | ❌ |
| HackerRank | ❌ | ❌ | ❌ | Partial | ❌ |
| Datadog | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

Built by **Suyash Srivastav**

- GitHub: [@suyashbuilds](https://github.com/suyashbuilds)

---

<p align="center">
  <strong>fracture.vercel.app &nbsp;·&nbsp; Break it here. Not in production.</strong>
</p>
