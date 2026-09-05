import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">
              RawDataFoods
            </h1>

            <p className="text-xs text-slate-500">
              Laboratory Worksheet System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Food Laboratory
            </span>

            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-white">
          <nav className="space-y-1 p-4">
            <a
              href="/dashboard"
              className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-100"
            >
              Dashboard
            </a>

            <a
              href="/worksheet"
              className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-100"
            >
              Worksheets
            </a>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;