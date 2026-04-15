import { Outlet, Link, useLocation } from "react-router";
import { Home, Sun, Moon, LogOut } from "lucide-react";
import { ApiStatus } from "./ApiStatus";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#181829] transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-[#1e1e2e] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors">
        <div className="max-w-[1880px] mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  NBA Stats
                </h1>
              </div>
            </Link>

            <div className="flex items-center gap-5">
              <ApiStatus />
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon size={18} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun size={18} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <nav className="flex gap-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-base font-medium ${
                    location.pathname === "/"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Home size={16} />
                  <span>Jogos</span>
                </Link>
              </nav>

              {user && (
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{user.email}</span>
                  <button
                    onClick={logout}
                    className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all group"
                    aria-label="Sair"
                    title="Sair"
                  >
                    <LogOut size={18} className="text-gray-700 dark:text-gray-300 group-hover:text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1880px] mx-auto w-full px-5 md:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
