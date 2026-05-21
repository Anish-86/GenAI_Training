import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StreamingOutput from "./StreamingOutput";

describe("StreamingOutput", () => {
  it("renders token chips and assembled text", () => {
    render(
      <StreamingOutput
        tokens={[
          { id: "0-Hel", content: "Hel" },
          { id: "1-lo", content: "lo" },
        ]}
        assembledText="Hello"
        isStreaming={false}
      />,
    );

    expect(screen.getByText("Hel")).toBeInTheDocument();
    expect(screen.getByText("lo")).toBeInTheDocument();
    expect(screen.getByLabelText("Assembled response text")).toHaveTextContent("Hello");
  });
});
