import { describe, expect, it } from "vitest";

import { dashboardRecords } from "../data/mockDashboardData";
import { filterDashboardRecords } from "./filterDashboardRecords";

describe("filterDashboardRecords", () => {
  it("filters by search term", () => {
    const result = filterDashboardRecords(dashboardRecords, {
      search: "chen",
      status: "all",
      department: "All departments",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Chen Wei");
  });

  it("filters by status and department together", () => {
    const result = filterDashboardRecords(dashboardRecords, {
      search: "",
      status: "active",
      department: "Engineering",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("USR-1001");
  });
});
