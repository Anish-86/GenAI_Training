export type SimulateMode = "none" | "latency" | "mid_stream_error";

export type StreamEventType = "token" | "error" | "done";

export interface StreamEventBase {
  type: StreamEventType;
}

export interface TokenStreamEvent extends StreamEventBase {
  type: "token";
  content: string;
  meta?: {
    simulated_latency_ms?: number;
    simulation?: string;
  };
}

export interface ErrorStreamEvent extends StreamEventBase {
  type: "error";
  message: string;
  fallback: string;
  partial?: boolean;
}

export interface DoneStreamEvent extends StreamEventBase {
  type: "done";
  partial: boolean;
  token_count?: number;
  meta?: {
    simulation?: string;
    note?: string;
  };
}

export type StreamEvent = TokenStreamEvent | ErrorStreamEvent | DoneStreamEvent;

export const FALLBACK_MESSAGE =
  "The assistant could not finish this response. Please try again in a moment.";
