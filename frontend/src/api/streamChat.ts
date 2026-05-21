import { parseSseChunk } from "../lib/parseSse";
import type { SimulateMode, StreamEvent } from "../types/stream";
import { FALLBACK_MESSAGE } from "../types/stream";

export interface StreamChatOptions {
  prompt: string;
  simulate?: SimulateMode;
  signal?: AbortSignal;
  onEvent: (event: StreamEvent) => void;
}

export async function streamChat({
  prompt,
  simulate = "none",
  signal,
  onEvent,
}: StreamChatOptions): Promise<void> {
  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, simulate }),
    signal,
  });

  if (!response.ok) {
    onEvent({
      type: "error",
      message: `Request failed with status ${response.status}.`,
      fallback: FALLBACK_MESSAGE,
    });
    onEvent({ type: "done", partial: false });
    return;
  }

  if (!response.body) {
    onEvent({
      type: "error",
      message: "Response body is empty.",
      fallback: FALLBACK_MESSAGE,
    });
    onEvent({ type: "done", partial: false });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseChunk(buffer);
      buffer = parsed.remainder;

      for (const event of parsed.events) {
        onEvent(event);
      }
    }

    if (buffer.trim()) {
      const parsed = parseSseChunk(`${buffer}\n\n`);
      for (const event of parsed.events) {
        onEvent(event);
      }
    }
  } catch (error) {
    if (signal?.aborted) {
      onEvent({ type: "done", partial: true });
      return;
    }

    const message =
      error instanceof Error ? error.message : "Unknown streaming error.";

    onEvent({
      type: "error",
      message,
      fallback: FALLBACK_MESSAGE,
      partial: true,
    });
    onEvent({ type: "done", partial: true });
  }
}
