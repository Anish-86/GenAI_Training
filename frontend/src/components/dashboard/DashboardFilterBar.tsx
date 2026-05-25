import type { DashboardFilterBarProps } from "../../types/dashboard";

export default function DashboardFilterBar({
  filters,
  departments,
  onFiltersChange,
  onApply,
  onReset,
  resultCount,
}: DashboardFilterBarProps) {
  return (
    <section
      aria-label="Dashboard record filters"
      className="rounded-lg border border-slate-700 bg-slate-900 p-4"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Filter bar
        </h2>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-xs text-slate-400"
        >
          Showing {resultCount} record{resultCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400" htmlFor="search-filter">
            Search
          </label>
          <input
            id="search-filter"
            type="search"
            placeholder="Search name, ID, department..."
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500 focus:ring-2"
            value={filters.search}
            onChange={(event) =>
              onFiltersChange({ ...filters, search: event.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400" htmlFor="status-filter">
            Status
          </label>
          <select
            id="status-filter"
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                status: event.target.value as DashboardFilterBarProps["filters"]["status"],
              })
            }
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label
            className="mb-1 block text-xs text-slate-400"
            htmlFor="department-filter"
          >
            Department
          </label>
          <select
            id="department-filter"
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={filters.department}
            onChange={(event) =>
              onFiltersChange({ ...filters, department: event.target.value })
            }
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            aria-label="Apply dashboard filters"
            className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            onClick={onApply}
          >
            Apply
          </button>
          <button
            type="button"
            aria-label="Reset dashboard filters"
            className="flex-1 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
