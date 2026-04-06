import { Outlet, Link, useLocation } from "react-router";
import { Home, BarChart3, Sparkles } from "lucide-react";
import { ApiStatus } from "./ApiStatus";

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NBA Analytics</h1>
                <p className="text-xs text-gray-400">Powered by AI</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <ApiStatus />
              <nav className="flex gap-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    location.pathname === "/"
                      ? "bg-orange-600 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Home size={18} />
                  <span className="hidden sm:inline">Jogos</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>NBA Analytics Frontend</p>
        </div>
      </footer>
    </div>
  );
}