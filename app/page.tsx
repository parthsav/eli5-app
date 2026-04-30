"use client";

import { useState, type FormEvent } from "react";

// In production (Vercel) leave NEXT_PUBLIC_API_URL unset so the frontend
// hits same-origin /api/chat. For local dev with separate uvicorn server,
// set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local.
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setReply("");

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail ?? `Request failed (${res.status})`);
      }

      const data: { reply: string } = await res.json();
      setReply(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Explain Like I&apos;m 5
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Ask anything. Get a kid-friendly explanation.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is gravity?"
            rows={4}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:ring-zinc-800"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || question.trim().length === 0}
            className="self-end rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
          >
            {loading ? "Thinking..." : "Explain"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {reply && (
          <section
            aria-live="polite"
            className="mt-6 rounded-lg bg-zinc-100 px-4 py-3 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <p className="whitespace-pre-wrap leading-relaxed">{reply}</p>
          </section>
        )}
      </div>
    </main>
  );
}
