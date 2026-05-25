import { useMemo, useState } from "react";

import {
  dashboardDepartments,
  dashboardNavItems,
  dashboardRecords,
} from "../../data/mockDashboardData";
import { filterDashboardRecords } from "../../lib/filterDashboardRecords";
import type { DashboardFilters } from "../../types/dashboard";
import DashboardDataTable from "./DashboardDataTable";
import DashboardFilterBar from "./DashboardFilterBar";
import DashboardSidebar from "./DashboardSidebar";

const defaultFilters: DashboardFilters = {
  search: "",
  status: "all",
  department: "All departments",
};

export default function DashboardPage() {
  const [activeNavId, setActiveNavId] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<DashboardFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<DashboardFilters>(defaultFilters);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const filteredRecords = useMemo(
    () => filterDashboardRecords(dashboardRecords, appliedFilters),
    [appliedFilters],
  );

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const handleResetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <DashboardSidebar
        navItems={dashboardNavItems}
        activeNavId={activeNavId}
        onNavigate={(navId) => {
          setActiveNavId(navId);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open sidebar navigation menu"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                Menu
              </button>
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Operations Dashboard
                </h1>
                <p className="text-sm text-slate-400">
                  3-panel layout: sidebar, filter bar, and data table
                </p>
              </div>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Active section: {activeNavId}
            </p>
          </div>
        </header>

        <main
          aria-label="Dashboard main content"
          className="flex-1 space-y-4 px-4 py-5 sm:px-6 sm:py-6"
        >
          <DashboardFilterBar
            filters={draftFilters}
            departments={dashboardDepartments}
            onFiltersChange={setDraftFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            resultCount={filteredRecords.length}
          />

          <DashboardDataTable
            records={filteredRecords}
            onViewRecord={setSelectedRecordId}
          />

          {selectedRecordId ? (
            <aside
              aria-label="Selected record details"
              className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-100"
            >
              <p>
                Viewing record <span className="font-mono">{selectedRecordId}</span>
              </p>
              <button
                type="button"
                aria-label="Close selected record details"
                className="mt-2 rounded-md border border-emerald-700 px-3 py-1 text-xs hover:bg-emerald-900/40"
                onClick={() => setSelectedRecordId(null)}
              >
                Close
              </button>
            </aside>
          ) : null}
        </main>
      </div>
    </div>
  );
}
