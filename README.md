# GenAI Streaming Lab

FastAPI backend streams Claude completions over **Server-Sent Events (SSE)**. A React client renders each token as it arrives, with basic error handling and deliberate edge-case simulations.

## Stack

- **Backend:** FastAPI + Anthropic Claude API
- **Frontend:** React + TypeScript (strict) + Tailwind + Vite
- **Tests:** Vitest

## Quick start

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API

`POST /api/chat/stream`

```json
{
  "prompt": "Explain SSE in one paragraph.",
  "simulate": "none"
}
```

`simulate` values:

| Value | Behavior |
|-------|----------|
| `none` | Normal Claude streaming |
| `latency` | Adds **350ms delay per token** (high-latency test) |
| `mid_stream_error` | Emits several fake tokens, then a **mid-stream error** (no API key needed) |

SSE event types: `token`, `error`, `done`.

## Edge-case behavior (what to observe)

### High latency (`simulate=latency`)

- Tokens arrive slowly but steadily; UI shows a pulsing “Streaming…” indicator.
- User can **Stop** mid-stream; partial assembled text remains.
- Good for verifying the client does not block the main thread and handles long gaps between chunks.

### Mid-stream API error (`simulate=mid_stream_error`)

- First ~8 tokens render normally.
- Server sends an `error` event with a fallback message, then `done` with `partial: true`.
- UI keeps partial output and shows an alert explaining the stream failed partway through.

### Missing API key (normal mode, no key configured)

- Server returns a single `error` event with fallback text instead of calling Claude.

## Manual curl test

```bash
curl -N -X POST http://127.0.0.1:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Say hello","simulate":"mid_stream_error"}'
```

## Dashboard lab (wireframe exercise)

3-panel React dashboard: sidebar + filter bar + data table.

```bash
cd frontend && npm run dev
```

Open http://localhost:5173 — **Dashboard** is the default view (use the floating switcher for Streaming).

Deliverables:

- Component: `frontend/src/components/dashboard/DashboardPage.tsx`
- Wireframe notes: `docs/WIREFRAME.md`
- Accessibility checklist: `ACCESSIBILITY_CHECKLIST.md`

## Tests

```bash
cd frontend && npm test
```
