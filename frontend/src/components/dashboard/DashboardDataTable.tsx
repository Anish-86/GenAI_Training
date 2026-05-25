import type { DashboardDataTableProps } from "../../types/dashboard";
import StatusBadge from "./StatusBadge";

export default function DashboardDataTable({
  records,
  onViewRecord,
}: DashboardDataTableProps) {
  return (
    <section
      aria-label="Dashboard records table"
      className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
          <caption className="sr-only">
            Operations dashboard records with ID, name, department, status, and last
            updated date
          </caption>
          <thead className="bg-slate-800/80 text-xs uppercase tracking-wide text-slate-300">
            <tr>
              <th scope="col" className="px-4 py-3">
                ID
              </th>
              <th scope="col" className="px-4 py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-3">
                Department
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Last updated
              </th>
              <th scope="col" className="px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No records match the current filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">
                    {record.id}
                  </td>
                  <td className="px-4 py-3 font-medium">{record.name}</td>
                  <td className="px-4 py-3">{record.department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-300">{record.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label={`View details for ${record.name}`}
                      className="rounded-md border border-slate-600 px-2.5 py-1 text-xs hover:bg-slate-800"
                      onClick={() => onViewRecord(record.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
