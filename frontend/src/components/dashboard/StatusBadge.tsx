import type { RecordStatus } from "../../types/dashboard";

interface StatusBadgeProps {
  status: RecordStatus;
}

const statusStyles: Record<RecordStatus, string> = {
  active: "bg-emerald-900/50 text-emerald-300 ring-emerald-700",
  pending: "bg-amber-900/50 text-amber-300 ring-amber-700",
  archived: "bg-slate-700/60 text-slate-300 ring-slate-600",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
