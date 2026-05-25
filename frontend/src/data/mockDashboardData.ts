import type { DashboardNavItem, DashboardRecord } from "../types/dashboard";

export const dashboardNavItems: DashboardNavItem[] = [
  { id: "overview", label: "Overview", href: "#overview", icon: "◉" },
  { id: "analytics", label: "Analytics", href: "#analytics", icon: "▣" },
  { id: "users", label: "Users", href: "#users", icon: "◎" },
  { id: "reports", label: "Reports", href: "#reports", icon: "▤" },
  { id: "settings", label: "Settings", href: "#settings", icon: "⚙" },
];

export const dashboardRecords: DashboardRecord[] = [
  {
    id: "USR-1001",
    name: "Aisha Khan",
    department: "Engineering",
    status: "active",
    lastUpdated: "2026-05-20",
  },
  {
    id: "USR-1002",
    name: "Marco Silva",
    department: "Product",
    status: "pending",
    lastUpdated: "2026-05-19",
  },
  {
    id: "USR-1003",
    name: "Priya Nair",
    department: "Operations",
    status: "active",
    lastUpdated: "2026-05-18",
  },
  {
    id: "USR-1004",
    name: "Jordan Lee",
    department: "Engineering",
    status: "archived",
    lastUpdated: "2026-05-10",
  },
  {
    id: "USR-1005",
    name: "Elena Rossi",
    department: "Finance",
    status: "active",
    lastUpdated: "2026-05-20",
  },
  {
    id: "USR-1006",
    name: "Sam Okafor",
    department: "Product",
    status: "pending",
    lastUpdated: "2026-05-17",
  },
  {
    id: "USR-1007",
    name: "Chen Wei",
    department: "Operations",
    status: "active",
    lastUpdated: "2026-05-16",
  },
  {
    id: "USR-1008",
    name: "Noah Brooks",
    department: "Finance",
    status: "archived",
    lastUpdated: "2026-05-05",
  },
];

export const dashboardDepartments: string[] = [
  "All departments",
  "Engineering",
  "Product",
  "Operations",
  "Finance",
];
