import type { StreamEvent } from "../types/stream";

export function parseSseChunk(buffer: string): {
  events: StreamEvent[];
  remainder: string;
} {
  const events: StreamEvent[] = [];
  const parts = buffer.split("\n\n");
  const remainder = parts.pop() ?? "";

  for (const part of parts) {
    const lines = part.split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) {
        continue;
      }

      const payload = line.slice(6).trim();
      if (!payload) {
        continue;
      }

      try {
        events.push(JSON.parse(payload) as StreamEvent);
      } catch {
        events.push({
          type: "error",
          message: "Malformed SSE payload from server.",
          fallback:
            "The assistant could not finish this response. Please try again in a moment.",
        });
      }
    }
  }

  return { events, remainder };
}
