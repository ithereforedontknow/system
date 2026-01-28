import { useEffect, useState } from "react";
import { Auth } from "./components/Auth";
import { TaskManager } from "./components/TaskManager";
import { Header } from "./components/Header";
import { supabase } from "./lib/supabase-client";
import type { Session } from "@supabase/supabase-js";
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // Check system preference if no localStorage value
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Save dark mode preference to localStorage whenever it changes
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    // Apply/remove dark class to document element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {session ? (
          <>
            <Header
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              logout={logout}
            />
            <TaskManager session={session} />
          </>
        ) : (
          <Auth />
        )}
      </div>
    </div>
  );
}

export default App;
