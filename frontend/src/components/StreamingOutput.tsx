import type { TokenChunk } from "../hooks/useStreamingChat";

interface StreamingOutputProps {
  tokens: TokenChunk[];
  assembledText: string;
  isStreaming: boolean;
}

export default function StreamingOutput({
  tokens,
  assembledText,
  isStreaming,
}: StreamingOutputProps) {
  return (
    <section
      aria-label="Streaming AI response output"
      className="rounded-lg border border-slate-700 bg-slate-900 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Live tokens
        </h2>
        {isStreaming ? (
          <span className="animate-pulse text-xs text-emerald-400">Streaming…</span>
        ) : null}
      </div>

      <div
        aria-label="Token-by-token stream display"
        className="mb-4 flex min-h-[3rem] flex-wrap gap-1"
      >
        {tokens.length === 0 ? (
          <p className="text-sm text-slate-500">Tokens will appear here as they arrive.</p>
        ) : (
          tokens.map((token) => (
            <span
              key={token.id}
              className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-cyan-300"
            >
              {token.content}
            </span>
          ))
        )}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Assembled text
        </h3>
        <p
          aria-label="Assembled response text"
          className="min-h-[6rem] whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-100"
        >
          {assembledText || "—"}
        </p>
      </div>
    </section>
  );
}
