import type { DashboardSidebarProps } from "../../types/dashboard";

export default function DashboardSidebar({
  navItems,
  activeNavId,
  onNavigate,
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-30 bg-slate-950/70 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        aria-label="Dashboard sidebar navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            GenAI Lab
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">Ops Console</h2>
        </div>

        <nav aria-label="Primary dashboard sections" className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.id === activeNavId;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <span aria-hidden="true" className="text-base">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-800 px-5 py-4">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-medium text-slate-100">Lab Operator</p>
        </div>
      </aside>
    </>
  );
}
