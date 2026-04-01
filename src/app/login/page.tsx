"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleVerifyToken(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Crisp
        </h1>
        <p className="mt-1 text-ink-muted">
          Daily communication practice
        </p>

        {sent ? (
          <form onSubmit={handleVerifyToken} className="mt-8 space-y-4">
            <div className="rounded-xl bg-sky/10 p-4">
              <p className="text-sm text-ink-muted">
                We sent a code to <strong>{email}</strong>
              </p>
            </div>

            <div>
              <label htmlFor="token" className="sr-only">
                Verification code
              </label>
              <input
                id="token"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                autoFocus
                className="w-full rounded-xl border border-paper-deep bg-paper-dim px-4 py-3 text-center text-lg tracking-widest text-ink placeholder:text-ink-ghost placeholder:text-sm placeholder:tracking-normal outline-none focus:border-sky focus:ring-1 focus:ring-sky transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-recording">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || token.length < 6}
              className="w-full rounded-xl bg-sky px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              onClick={() => { setSent(false); setToken(""); setError(""); }}
              className="w-full text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Use a different email
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendCode} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full rounded-xl border border-paper-deep bg-paper-dim px-4 py-3 text-ink placeholder:text-ink-ghost outline-none focus:border-sky focus:ring-1 focus:ring-sky transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-recording">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
