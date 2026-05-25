import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DashboardPage from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders sidebar, filter bar, and data table landmarks", () => {
    render(<DashboardPage />);

    expect(screen.getByLabelText("Dashboard sidebar navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("Dashboard record filters")).toBeInTheDocument();
    expect(screen.getByLabelText("Dashboard records table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Operations Dashboard" })).toBeInTheDocument();
  });

  it("filters records when apply is clicked", () => {
    render(<DashboardPage />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Chen" } });
    fireEvent.click(screen.getByLabelText("Apply dashboard filters"));

    expect(screen.getByText("Chen Wei")).toBeInTheDocument();
    expect(screen.queryByText("Aisha Khan")).not.toBeInTheDocument();
  });
});
