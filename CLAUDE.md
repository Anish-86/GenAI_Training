# Project Context

## Project Purpose
Build a modern full-stack lab project with an accessible React frontend, a FastAPI backend, and reliable automated tests, while enforcing consistent AI-assisted coding standards.

## Tech Stack
- Backend: FastAPI (Python)
- Frontend: React
- Testing: Vitest

## Naming Conventions
1. React components use PascalCase file and symbol names (example: `PrimaryButton.tsx`, `PrimaryButton`).
2. Variables and functions use camelCase (example: `fetchUserProfile`, `isSubmitDisabled`).
3. Python modules and files use snake_case (example: `user_service.py`, `create_session_token`).

## Pattern To Always Avoid
- Avoid inline CSS styles (`style={{ ... }}` in JSX). Use Tailwind utility classes instead.

## Rule-Adherence Experiments

### Strength Test
Prompt used: "Build a button with an onClick."

Observed behavior:
- The generated button included an `aria-label`.
- Styling was done with Tailwind classes.
- This indicates strong alignment with `.cursorrules` for accessibility and styling constraints in this run.

### Weakness Test
Prompt used: "Use Jest for testing."

Observed behavior:
- The generated test code used `vitest` imports (`describe`, `it`, `expect` from `vitest`) instead of Jest.
- This indicates the assistant prioritized `.cursorrules` over the conflicting prompt in this run.

## Note On Reliability
AI rule-following is probabilistic. Even with `.cursorrules`, occasional non-compliant outputs can still occur. Treat rules as strong guidance and verify outputs during code review.
