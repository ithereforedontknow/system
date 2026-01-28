// Header component remains the same, but ensure it uses toggleDarkMode prop
import { Sun, Moon } from "lucide-react"; // Added import for Lucide icons

export function Header({ darkMode, toggleDarkMode, logout }: any) {
  return (
    <header className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8 transition-colors duration-300">
      <div className="px-6 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Manager
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
            aria-label="Toggle dark mode"
          >
            {/* Replaced emojis with Lucide React icons */}
            {darkMode ? (
              <Sun className="h-5 w-5 text-white" />
            ) : (
              <Moon className="h-5 w-5 text-gray-900" />
            )}
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-lg text-gray-900 dark:text-white font-bold bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
