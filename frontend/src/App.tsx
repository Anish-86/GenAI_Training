import { useState } from "react";

import DashboardPage from "./components/dashboard/DashboardPage";
import StreamChatPanel from "./components/StreamChatPanel";

type LabView = "dashboard" | "streaming";

export default function App() {
  const [view, setView] = useState<LabView>("dashboard");

  return (
    <>
      <nav
        aria-label="Lab section switcher"
        className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-lg"
      >
        <button
          type="button"
          aria-label="Open operations dashboard lab"
          className={`rounded-md px-3 py-1.5 text-xs ${
            view === "dashboard" ? "bg-emerald-600 text-white" : "text-slate-300"
          }`}
          onClick={() => setView("dashboard")}
        >
          Dashboard
        </button>
        <button
          type="button"
          aria-label="Open streaming AI lab"
          className={`rounded-md px-3 py-1.5 text-xs ${
            view === "streaming" ? "bg-emerald-600 text-white" : "text-slate-300"
          }`}
          onClick={() => setView("streaming")}
        >
          Streaming
        </button>
      </nav>

      {view === "dashboard" ? <DashboardPage /> : <StreamChatPanel />}
    </>
  );
}
