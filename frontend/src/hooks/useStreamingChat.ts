import { useCallback, useRef, useState } from "react";

import { streamChat } from "../api/streamChat";
import type { SimulateMode, StreamEvent } from "../types/stream";
import { FALLBACK_MESSAGE } from "../types/stream";

export type StreamStatus = "idle" | "streaming" | "done" | "error";

export interface TokenChunk {
  id: string;
  content: string;
}

export interface StreamingState {
  status: StreamStatus;
  tokens: TokenChunk[];
  assembledText: string;
  errorMessage: string | null;
  fallbackMessage: string | null;
  isPartial: boolean;
  tokenCount: number;
  simulation: string | null;
}

const initialState: StreamingState = {
  status: "idle",
  tokens: [],
  assembledText: "",
  errorMessage: null,
  fallbackMessage: null,
  isPartial: false,
  tokenCount: 0,
  simulation: null,
};

export function useStreamingChat() {
  const [state, setState] = useState<StreamingState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(initialState);
  }, []);

  const handleEvent = useCallback((event: StreamEvent) => {
    setState((previous) => {
      if (event.type === "token") {
        const chunk: TokenChunk = {
          id: `${previous.tokenCount}-${event.content}`,
          content: event.content,
        };

        return {
          ...previous,
          status: "streaming",
          tokens: [...previous.tokens, chunk],
          assembledText: previous.assembledText + event.content,
          tokenCount: previous.tokenCount + 1,
          simulation: event.meta?.simulation ?? previous.simulation,
        };
      }

      if (event.type === "error") {
        return {
          ...previous,
          status: "error",
          errorMessage: event.message,
          fallbackMessage: event.fallback ?? FALLBACK_MESSAGE,
          isPartial: event.partial ?? previous.tokenCount > 0,
        };
      }

      return {
        ...previous,
        status: previous.status === "error" ? "error" : "done",
        isPartial: event.partial,
        simulation: event.meta?.simulation ?? previous.simulation,
      };
    });
  }, []);

  const startStream = useCallback(
    async (prompt: string, simulate: SimulateMode = "none") => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        ...initialState,
        status: "streaming",
      });

      await streamChat({
        prompt,
        simulate,
        signal: controller.signal,
        onEvent: handleEvent,
      });
    },
    [handleEvent],
  );

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState((previous) => ({
      ...previous,
      status: previous.tokenCount > 0 ? "done" : "idle",
      isPartial: previous.tokenCount > 0,
    }));
  }, []);

  return {
    state,
    startStream,
    stopStream,
    reset,
  };
}
