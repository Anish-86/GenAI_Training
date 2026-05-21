import { describe, expect, it } from "vitest";

import { parseSseChunk } from "./parseSse";

describe("parseSseChunk", () => {
  it("parses token and done events from SSE chunks", () => {
    const buffer =
      'data: {"type":"token","content":"Hi"}\n\n' +
      'data: {"type":"done","partial":false}\n\n';

    const result = parseSseChunk(buffer);

    expect(result.remainder).toBe("");
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toEqual({ type: "token", content: "Hi" });
    expect(result.events[1]).toEqual({ type: "done", partial: false });
  });

  it("keeps incomplete chunks in remainder", () => {
    const buffer = 'data: {"type":"token","content":"Par';

    const result = parseSseChunk(buffer);

    expect(result.events).toHaveLength(0);
    expect(result.remainder).toBe(buffer);
  });

  it("emits error event for malformed JSON", () => {
    const buffer = "data: not-json\n\n";

    const result = parseSseChunk(buffer);

    expect(result.events[0]?.type).toBe("error");
  });
});
