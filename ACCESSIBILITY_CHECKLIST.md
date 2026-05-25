# Dashboard Accessibility Checklist

Lab wireframe: **3-panel dashboard** — left sidebar navigation, top filter bar, main data table.

Component entry point: `frontend/src/components/dashboard/DashboardPage.tsx`

## Landmarks and structure

| Check | Status | Implementation |
|-------|--------|----------------|
| Page has a single logical `main` landmark | ✅ | `<main aria-label="Dashboard main content">` |
| Sidebar is a distinct navigation region | ✅ | `<aside aria-label="Dashboard sidebar navigation">` + `<nav aria-label="Primary dashboard sections">` |
| Filter controls grouped in a labeled region | ✅ | `<section aria-label="Dashboard record filters">` |
| Data table in a labeled region | ✅ | `<section aria-label="Dashboard records table">` |

## Tables

| Check | Status | Implementation |
|-------|--------|----------------|
| Table has a caption (visible or screen-reader) | ✅ | `<caption className="sr-only">` |
| Column headers use `scope="col"` | ✅ | All `<th>` elements in header row |
| Empty state is announced in table body | ✅ | “No records match the current filters.” row |

## Forms and controls

| Check | Status | Implementation |
|-------|--------|----------------|
| Every input has a visible `<label>` | ✅ | Search, status, department fields |
| Every interactive control has accessible name | ✅ | Visible `<label>` for inputs; `aria-label` on icon-only/button actions |
| Search input uses `type="search"` | ✅ | `#search-filter` |
| Filter result count updates for assistive tech | ✅ | `aria-live="polite"` on result count |
| Current nav item indicated | ✅ | `aria-current="page"` on active sidebar button |

## Keyboard and mobile

| Check | Status | Implementation |
|-------|--------|----------------|
| All actions reachable by keyboard | ✅ | Native buttons, inputs, selects |
| Mobile sidebar can be opened and dismissed | ✅ | Menu button + overlay click closes drawer |
| Table scrolls horizontally on small screens | ✅ | `overflow-x-auto` wrapper |
| Focus order follows visual layout | ✅ | Header → filters → table → detail panel |

## Color and content

| Check | Status | Implementation |
|-------|--------|----------------|
| Status not conveyed by color alone | ✅ | Text label inside `StatusBadge` |
| Sufficient text contrast on dark theme | ✅ | Tailwind `slate` / `emerald` palette |
| Decorative icons hidden from AT | ✅ | `aria-hidden="true"` on nav icons |

## Manual verification (recommended before submit)

- [ ] Tab through sidebar, filters, table actions without mouse
- [ ] Open sidebar on mobile width (< 1024px), close via overlay
- [ ] Run VoiceOver/NVDA: hear landmarks, table headers, live result count
- [ ] Zoom to 200%: filter bar stacks, table remains usable
- [ ] Apply + Reset filters: count and rows update predictably

## Known gaps / follow-ups

- Sortable column headers not implemented (wireframe listed view-only table)
- Skip link to main content not added (nice-to-have for keyboard users)
- Focus trap inside mobile drawer not implemented (overlay dismiss is supported)
