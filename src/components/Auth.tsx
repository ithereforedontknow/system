import { useState, type FormEvent, type ChangeEvent } from "react";
import { supabase } from "../lib/supabase-client";

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 transition-colors duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                // Disable input so user can't change email mid-request
                disabled={loading}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 transition-colors duration-200"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              // This prevents clicking while the request is in flight
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg text-gray-900 dark:text-white font-bold bg-gray-200 dark:bg-neutral-800 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  {/* Simple CSS Spinner */}
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </button>

            {/* Also disable the toggle button during loading */}
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="w-full px-4 py-2.5 rounded-lg text-gray-900 dark:text-white font-bold bg-gray-200 dark:bg-neutral-800 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
