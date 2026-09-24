# GoodOff — Study Deck Workspace

A small study app for turning topics or notes into question-and-answer decks. It uses React, Node.js/Express, and the Gemini API.

---

## 1. Project Overview

GoodOff accepts a topic or pasted notes, requests card data from the server, validates the response, and presents the result as a study deck.

### Time spent
- Total time spent: ~ 4 hours
- Main work: AI schema design, bad-output validation, frontend study flow, and mobile polish
- Most time-intensive part: handling malformed or incomplete AI output without breaking the UX
- Next improvements: add automated tests, stronger semantic validation, and a server-side timeout status UI

### AI usage note
- I used AI tools during development for prompt design, schema iteration, validation ideas, and edge-case review.
- The final implementation, UI logic, and debugging were completed by me and verified locally.
- The app keeps the API key on the server and never exposes it in the browser.

### Why this architecture matters:
- **Structured response**: The server requests JSON card data and the client validates the result before rendering it.
- **Safety Boundary**: Malformed or non-conforming AI output is trapped and prevented from crashing the React tree or corrupting state.
- **Stale-response protection**: Request IDs and `AbortController` prevent an older response from replacing a newer one.
- **Mastery & Review Cycle**: Users evaluate cards as *"I knew it"* or *"I got it wrong"*, with dedicated review rounds for missed cards.

---

## 2. Features

- **Topic & Notes Input**: Clean, controlled textarea with keyboard submission (`Ctrl+Enter` / `Cmd+Enter`), empty input prevention, and quick-load starter topics.
- **Structured card generation**: The server requests JSON from Gemini and validates the returned cards.
- **Comprehensive Validation Layer**: Validates existence, JSON parseability, root shape, array types, non-empty cards, and valid string content for both questions and answers.
- **Flashcard review**: Flip cards with a click or keyboard `Space` / `Enter`.
- **Deck Navigation & Progress**: Card counter (`Card 3 of 6`), percentage progress bar, previous/next controls, and keyboard arrow key navigation.
- **Active Recall Evaluation**:
  - *"I knew it"* (records mastery, advances card)
  - *"I got it wrong"* (records concept for review)
- **Targeted Wrong-Answer Review**: Filter mode allowing students to focus exclusively on missed cards until 100% mastery is achieved.
- **Deck Completion Summary**: Performance breakdown with accuracy percentage and options to review wrong cards or restart.
- **Stale request protection**: Aborts older requests so a slower response cannot replace a newer deck.
- **Graceful Error States & Retry**: Clear categorization of validation errors vs network errors, with an expandable error inspector and one-click retry.
- **Interactive Evaluator Test Suite**: Collapsible tester toolbar allowing evaluators to simulate malformed JSON, wrong schemas, empty lists, slow networks, and rapid-fire race conditions on demand.

---

## 3. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Build Tool**: Vite 8
- **Backend**: Node.js, Express 4, `tsx` runtime
- **AI SDK**: `@google/genai` (Gemini 3.8 Flash model with JSON Schema enforcement)
- **Environment Management**: `dotenv`

---

## 4. Project Structure

```text
├── server.ts                    # Root Express server & Vite middleware bridge
├── server/
│   └── server.ts                # Server module export for directory compatibility
├── src/
│   ├── types/
│   │   └── flashcard.ts         # TypeScript interfaces (FlashcardItem, ValidationResult, etc.)
│   ├── lib/
│   │   ├── api.ts               # Frontend API client (POST /api/generate with AbortSignal)
│   │   └── validateResult.ts    # Standalone validation function for raw AI output
│   ├── components/
│   │   ├── PromptInput.tsx      # Controlled input with suggestions & validation
│   │   ├── FlashcardDeck.tsx    # Deck manager, navigation, mastery tracking & review mode
│   │   ├── Flashcard.tsx        # 3D interactive flip card with front & back faces
│   │   ├── LoadingState.tsx     # Loading animation with request cancellation
│   │   ├── ErrorState.tsx       # Error screen with technical details & retry button
│   │   ├── EmptyState.tsx       # Welcoming view with feature highlights & starter cards
│   │   └── TestScenariosBar.tsx # Evaluator tool to trigger edge cases & race conditions
│   ├── App.tsx                  # Root application state, request dispatch & lifecycle
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind CSS imports & 3D transform utilities
├── .env.example                 # Template for environment variables
├── metadata.json                # Project metadata & server capabilities
├── package.json                 # Scripts and dependencies
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration with path aliases
```

---

## 5. How the Application Works

```text
┌──────────────┐
│  User Input  │ (Topic or Lecture Notes)
└──────┬───────┘
       │ Submit (validates non-empty)
       ▼
┌───────────────────┐
│  Frontend Client  │ (src/lib/api.ts)
│  (React State)    │ • Increments activeRequestIdRef
└──────┬────────────┘ • Aborts previous fetch via AbortController
       │ POST /api/generate
       ▼
┌───────────────────┐
│  Express Backend  │ (server.ts)
│  (Port 3000)      │ • Server-side API key protection
└──────┬────────────┘ • Formats active-recall system prompt
       │ @google/genai SDK (responseSchema: OBJECT { cards: ARRAY })
       ▼
┌───────────────────┐
│  Gemini 3.8 Flash │ • Enforces valid JSON according to schema
└──────┬────────────┘
       │ Returns structured JSON string
       ▼
┌───────────────────┐
│  Express Backend  │ • Parses JSON & sends to client
└──────┬────────────┘
       │ HTTP Response { cards: [...] }
       ▼
┌───────────────────┐
│ Stale-Check Guard │ • Discards response if activeRequestIdRef has changed
└──────┬────────────┘
       │ Passed
       ▼
┌───────────────────┐
│  Validation Layer │ (src/lib/validateResult.ts)
│                   │ • Validates array, length, string types, non-empty fields
└──────┬────────────┘
       │
   ┌───┴────────────────────────┐
   │ Valid                      │ Invalid / Error
   ▼                            ▼
┌───────────────────────┐   ┌───────────────────────┐
│  Render FlashcardDeck │   │   Render ErrorState   │
│  (Flip, Next, Review) │   │   (Shows cause/retry) │
└───────────────────────┘   └───────────────────────┘
```

---

## 6. Setup Instructions

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))

### Installation
Clone or open the repository in your workspace and install dependencies:
```bash
npm install
```

---

## 7. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# GEMINI_API_KEY: Required for server-side Gemini AI calls
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# PORT: Optional port for the Express server (defaults to 3000)
PORT=3000
```

> **Security Note**: `GEMINI_API_KEY` is loaded strictly on the server in `server.ts`. It is **never** prefixed with `VITE_` and is **never** bundled or transmitted to client browser code.

---

## 8. How to Run the Application

The project uses a unified full-stack architecture where Express hosts API routes and serves the Vite React application.

### Development Mode (Frontend + Backend unified)
```bash
npm run dev
```
This runs `tsx server.ts`. The Express server starts on port `3000` and attaches Vite development middlewares for hot compilation and client serving.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Preview
```bash
npm run build
npm start
```
`npm run build` compiles the React assets into `dist/`. `npm start` runs the server in production mode, serving pre-built static assets.

---

## 9. How AI Structured Output Works

To eliminate messy markdown parsing and hallucinations, we leverage Gemini's native `responseSchema` and `responseMimeType: "application/json"`:

```typescript
import { Type } from '@google/genai';

const response = await aiClient.models.generateContent({
  model: 'gemini-3.8-flash',
  contents: prompt,
  config: {
    systemInstruction: 'You are an educational study deck generator. You strictly output valid JSON adhering to the provided schema.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        cards: {
          type: Type.ARRAY,
          description: 'A collection of active recall flashcards.',
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The front question or concept prompt.',
              },
              answer: {
                type: Type.STRING,
                description: 'The concise explanation or solution.',
              },
            },
            required: ['question', 'answer'],
          },
        },
      },
      required: ['cards'],
    },
  },
});
```

The server requests a response shaped like `{ "cards": [{ "question": "...", "answer": "..." }] }` and the client validates the returned data.

---

## 10. Validation & Error Handling

Even when schema enforcement is enabled on the model, frontend code should **never assume AI output is infallible**. The application passes all raw responses through `validateResult(rawData)` before updating state.

### Validation Checks:
1. **Response Existence**: Verifies data is not `null` or `undefined`.
2. **Safe JSON Parsing**: If received as a string, parses inside a `try/catch` block.
3. **Root Shape**: Confirms data is a JavaScript object (not an array or primitive).
4. **Cards Property**: Confirms `"cards"` exists in the object.
5. **Array Type**: Confirms `cards` is an `Array`.
6. **Non-Empty Array**: Confirms `cards.length > 0`.
7. **Card Object Validity**: Verifies each card item is a non-null object.
8. **Question Validity**: Checks that `card.question` exists, is of type `string`, and is not blank after trimming.
9. **Answer Validity**: Checks that `card.answer` exists, is of type `string`, and is not blank after trimming.

If validation fails, `validateResult` returns:
```typescript
{
  isValid: false,
  cards: null,
  error: "Descriptive error message explaining the exact validation failure"
}
```
React intercepts this and displays the `ErrorState` component with a Retry button, preventing any broken or empty cards from rendering.

---

## 11. Stale-Response Protection (Race Conditions)

### The Problem:
A user inputs Topic A (*"Teach me React"*) and clicks Generate. They immediately change their mind, type Topic B (*"Teach me Node.js"*), and click Generate again.
If Request A is delayed by network lag and completes *after* Request B, a naive application would overwrite Topic B's flashcards with Topic A's cards!

### The Solution:
We combine two layers of protection in `App.tsx`:
1. **Monotonic Request IDs (`useRef`)**:
   ```typescript
   const activeRequestIdRef = useRef<number>(0);

   const handleGenerate = async (topic: string) => {
     const requestId = ++activeRequestIdRef.current;
     // ... await fetch ...
     if (activeRequestIdRef.current !== requestId) {
       // A newer request has been initiated; drop this outdated response!
       return;
     }
     // Apply state
   };
   ```
2. **Fetch Abort Signals (`AbortController`)**:
   Before initiating a new request, any active controller is aborted:
   ```typescript
   if (abortControllerRef.current) {
     abortControllerRef.current.abort();
   }
   const controller = new AbortController();
   abortControllerRef.current = controller;
   ```
   This terminates unnecessary network transfers early while ensuring only the freshest request updates the UI.

---

## 12. Edge Case Testing & Verification

The project includes an in-app **Evaluator / Interview Test Suite** bar at the bottom of the page to verify all required test scenarios:

| # | Scenario | How to Test | Expected Behavior |
|---|---|---|---|
| 1 | **Normal Valid Input** | Type "Teach me binary search" and click Generate | Flashcard deck renders with 5-8 cards |
| 2 | **Empty Input** | Leave textarea blank and click Generate | Input validation message appears; request blocked |
| 3 | **API Failure** | Click "Simulate API 500 Error" in test bar | ErrorState appears with retry button |
| 4 | **Malformed JSON** | Click "Malformed JSON" in test bar | Validation catches syntax error; ErrorState displays reason |
| 5 | **Wrong JSON Structure** | Click "Wrong JSON Shape" in test bar | Validation catches missing `cards` property |
| 6 | **Empty Cards Array** | Click "Empty Cards List" in test bar | Validation catches `cards: []` and blocks render |
| 7 | **Missing Question Field** | Click "Missing Card Question" in test bar | Validation identifies item missing question |
| 8 | **Slow Request** | Click "Slow Request (3.5s)" in test bar | Loading state shows spinner & Cancel button |
| 9 | **Race Condition / Stale Response** | Click "Rapid Double Request" in test bar | Request A (slow) is discarded; Request B wins |
| 10 | **Retry after Failure** | In ErrorState, click "Retry Request" | Re-submits active topic seamlessly |
| 11 | **Card Navigation** | Use Previous / Next buttons or Arrow keys | Moves through deck with progress updates |
| 12 | **Card Flipping** | Click card, Flip button, or press Space | Smooth 3D flip between question and answer |
| 13 | **Mark Knowledge** | Click "I knew it" or "I got it wrong" | Badges update and score is tallied |
| 14 | **Review Wrong Answers** | Click "Review Wrong Answers" | Filters deck to only missed cards |
| 15 | **Mobile Responsive** | Resize browser or inspect in mobile viewport | Responsive layout with stacked controls |

---

## 13. AI Usage Note

AI tools (specifically Google Gemini models via AI Studio) were utilized for:
- Brainstorming structural requirements and typical interview assessment questions.
- Generating the flashcard response payloads during runtime.
- Assisting with code review and edge-case enumeration.

The project keeps the server, API client, validation, and UI components separate so each part is easy to test and change.

---

## 14. Known Limitations

1. **In-Memory Study State**: Marked answers and custom decks are stored in React component state. Refreshing the browser resets the session. (Can be persisted to `localStorage` or Firestore if cross-session sync is needed).
2. **Rate Limits on Free Tier**: Rapid consecutive requests may encounter temporary rate limits from the AI provider; the backend implements automatic retry and model fallback across `gemini-3.8-flash` and `gemini-flash-latest`.
3. **Text-Only Cards**: Flashcards currently support text and code snippets; diagram/image generation is not included in this release.

---

