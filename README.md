# 🛡️ Text Sanitizer — AI Response & Text Formatting Cleaner

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

**Text Sanitizer** is a modern, high-performance web application designed to automatically strip AI disclaimers, boilerplate intro/outro phrases, markdown syntax, duplicate sentences, emojis, and custom forbidden phrases from raw text while preserving the core meaning.

Featuring a **Glassmorphism UI** with ambient **Green & Blue gradient meshes**, instant client-side execution, and a headless REST API.

---

## ✨ Features

- **⚡ Zero-Latency Client-Side Cleaning:** Instant text sanitization running synchronously in the browser with real-time stats.
- **🏷️ Smart Word-Sequence Custom Phrase Filter:** Add any phrase or boilerplate text to remove. The engine automatically matches the word sequence across line breaks, case variations, punctuation, and markdown symbols.
- **🎨 Glassmorphism & Green-Blue Aesthetic:** Premium frosted glass panels (`backdrop-blur-xl`), translucent borders, and ambient emerald/cyan glowing background mesh.
- **📑 1-Click Preset Profiles:**
  - **All Active:** Complete sanitization (Markdown, Boilerplate, Duplicates, Emojis, Custom Phrases).
  - **AI Only:** Focuses strictly on removing AI intro disclaimers and concluding policy boilerplate.
  - **Markdown Only:** Strips headers, bold/italics, lists, and code blocks while keeping raw text intact.
  - **Minimal:** Lightweight cleanup (spaces and blank line collapse).
- **📊 Real-Time Metrics Dashboard:**
  - Cleaned vs. original word and character counts.
  - Reduction percentage & character count saved.
  - Processing speed in milliseconds.
  - Estimated reading time saved.
- **🔍 Side-by-Side Diff Mode:** Easily compare raw input against the sanitized output line-by-line.
- **🌓 Seamless Dark & Light Mode:** Fully responsive theme switching with high-contrast accessibility.
- **🚀 Headless REST API (`/api/clean`):** Integrate the sanitization engine programmatically into scripts, web apps, or backend pipelines.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism CSS
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** Optimized for [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adiptify/Text_Sanitizer.git
   cd Text_Sanitizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 REST API Usage

You can send text sanitization requests directly to the headless REST API endpoint at `/api/clean`.

### Request Example (`POST /api/clean`)

```bash
curl -X POST http://localhost:3000/api/clean \
  -H "Content-Type: application/json" \
  -d '{
    "text": "As an AI language model, ### Hello World! 🚀",
    "rules": {
      "markdown": true,
      "aiBoilerplate": true,
      "emojis": true,
      "customPhrases": true
    },
    "customRules": [
      { "id": "1", "phrase": "Hello World", "enabled": true }
    ]
  }'
```

### JSON Response

```json
{
  "success": true,
  "cleanedText": "World!",
  "metrics": {
    "originalWordCount": 8,
    "cleanedWordCount": 1,
    "originalCharCount": 44,
    "cleanedCharCount": 6,
    "wordsRemoved": 7,
    "charsRemoved": 38,
    "reductionPercentage": 86.4,
    "processingTimeMs": 0.4,
    "timeSavedSeconds": 2
  }
}
```

---


---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
