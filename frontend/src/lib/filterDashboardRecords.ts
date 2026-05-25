import type { DashboardFilters, DashboardRecord } from "../types/dashboard";

export function filterDashboardRecords(
  records: DashboardRecord[],
  filters: DashboardFilters,
): DashboardRecord[] {
  const searchTerm = filters.search.trim().toLowerCase();

  return records.filter((record) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      record.name.toLowerCase().includes(searchTerm) ||
      record.id.toLowerCase().includes(searchTerm) ||
      record.department.toLowerCase().includes(searchTerm);

    const matchesStatus =
      filters.status === "all" || record.status === filters.status;

    const matchesDepartment =
      filters.department === "All departments" ||
      record.department === filters.department;

    return matchesSearch && matchesStatus && matchesDepartment;
  });
}
