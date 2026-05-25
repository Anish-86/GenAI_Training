export type RecordStatus = "active" | "pending" | "archived";

export interface DashboardNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface DashboardRecord {
  id: string;
  name: string;
  department: string;
  status: RecordStatus;
  lastUpdated: string;
}

export interface DashboardFilters {
  search: string;
  status: RecordStatus | "all";
  department: string;
}

export interface DashboardSidebarProps {
  navItems: DashboardNavItem[];
  activeNavId: string;
  onNavigate: (navId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface DashboardFilterBarProps {
  filters: DashboardFilters;
  departments: string[];
  onFiltersChange: (filters: DashboardFilters) => void;
  onApply: () => void;
  onReset: () => void;
  resultCount: number;
}

export interface DashboardDataTableProps {
  records: DashboardRecord[];
  onViewRecord: (recordId: string) => void;
}
