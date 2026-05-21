import { FormEvent, useState } from "react";

import { useStreamingChat } from "../hooks/useStreamingChat";
import type { SimulateMode } from "../types/stream";
import StreamingOutput from "./StreamingOutput";

const DEFAULT_PROMPT = "Explain server-sent events in two short paragraphs.";

export default function StreamChatPanel() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [simulate, setSimulate] = useState<SimulateMode>("none");
  const { state, startStream, stopStream, reset } = useStreamingChat();

  const isStreaming = state.status === "streaming";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void startStream(prompt.trim(), simulate);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 text-slate-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Streaming AI Lab</h1>
        <p className="mt-2 text-slate-400">
          FastAPI + Claude API over SSE, rendered token-by-token in React.
        </p>
      </header>

      <form
        aria-label="Streaming chat form"
        className="mb-6 space-y-4 rounded-lg border border-slate-700 bg-slate-900 p-4"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm text-slate-300" htmlFor="prompt-input">
          Prompt
        </label>
        <textarea
          id="prompt-input"
          aria-label="Chat prompt input"
          className="h-28 w-full rounded-md border border-slate-600 bg-slate-950 p-3 text-sm text-slate-100 outline-none ring-emerald-500 focus:ring-2"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={isStreaming}
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-300" htmlFor="simulate-select">
            Edge-case simulation
          </label>
          <select
            id="simulate-select"
            aria-label="Edge case simulation mode"
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
            value={simulate}
            onChange={(event) => setSimulate(event.target.value as SimulateMode)}
            disabled={isStreaming}
          >
            <option value="none">Normal</option>
            <option value="latency">High latency (350ms/token)</option>
            <option value="mid_stream_error">Mid-stream API error</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            aria-label="Start streaming completion"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isStreaming || prompt.trim().length === 0}
          >
            Stream response
          </button>
          <button
            type="button"
            aria-label="Stop active stream"
            className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={stopStream}
            disabled={!isStreaming}
          >
            Stop
          </button>
          <button
            type="button"
            aria-label="Clear stream output"
            className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
            onClick={reset}
          >
            Clear
          </button>
        </div>
      </form>

      {state.errorMessage ? (
        <div
          aria-label="Stream error message"
          className="mb-4 rounded-lg border border-rose-700 bg-rose-950/40 p-4 text-sm text-rose-200"
          role="alert"
        >
          <p className="font-semibold">Stream error</p>
          <p className="mt-1">{state.errorMessage}</p>
          {state.fallbackMessage ? (
            <p className="mt-2 text-rose-100/90">{state.fallbackMessage}</p>
          ) : null}
          {state.isPartial ? (
            <p className="mt-2 text-xs text-rose-300">
              Partial output preserved ({state.tokenCount} tokens received before failure).
            </p>
          ) : null}
        </div>
      ) : null}

      <StreamingOutput
        tokens={state.tokens}
        assembledText={state.assembledText}
        isStreaming={isStreaming}
      />

      <footer className="mt-4 text-xs text-slate-500">
        Status: {state.status}
        {state.simulation ? ` · simulation: ${state.simulation}` : ""}
        {state.tokenCount > 0 ? ` · tokens: ${state.tokenCount}` : ""}
      </footer>
    </main>
  );
}
