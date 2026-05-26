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
# Add ANTHROPIC_API_KEY to .env (optional for streaming lab)
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## User feedback CRUD API (Day 7)

Full REST CRUD for user feedback with Pydantic schemas, SQLAlchemy ORM, Alembic migrations, and auto-generated OpenAPI.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/feedback` | Create feedback |
| `GET` | `/api/feedback` | List feedback (`?skip=&limit=&status=`) |
| `GET` | `/api/feedback/{id}` | Get one record |
| `PUT` | `/api/feedback/{id}` | Update feedback |
| `DELETE` | `/api/feedback/{id}` | Delete feedback |

- **OpenAPI UI:** http://127.0.0.1:8000/docs
- **OpenAPI JSON:** http://127.0.0.1:8000/openapi.json

### Example requests

```bash
# Create
curl -X POST http://127.0.0.1:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"user_email":"user@example.com","subject":"Login issue","message":"Cannot reset password","rating":2}'

# List
curl http://127.0.0.1:8000/api/feedback

# Update
curl -X PUT http://127.0.0.1:8000/api/feedback/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_review"}'

# Delete
curl -X DELETE http://127.0.0.1:8000/api/feedback/1
```

### Migrations

```bash
cd backend
alembic upgrade head    # apply
alembic downgrade -1    # rollback one revision
```

## Streaming API

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
