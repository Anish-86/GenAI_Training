# Wireframe Description (Lab Input)

## Layout: 3-panel operations dashboard

### Panel 1 — Sidebar (left, fixed)

- App brand: “Ops Console”
- Primary navigation: Overview, Analytics, Users, Reports, Settings
- Active nav item highlighted
- Footer: signed-in user label
- Mobile: off-canvas drawer with menu toggle

### Panel 2 — Filter bar (top of main content)

- Search field (name, ID, department)
- Status dropdown: All / Active / Pending / Archived
- Department dropdown
- Apply and Reset buttons
- Live result count (“Showing N records”)

### Panel 3 — Data table (main content)

| ID | Name | Department | Status | Last updated | Actions |
|----|------|------------|--------|--------------|---------|
| rows of mock operational records | | | badge | date | View button |

- Empty state when filters match nothing
- Horizontal scroll on narrow viewports

### Header (above panels 2–3)

- Page title: “Operations Dashboard”
- Mobile menu button for sidebar
