import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="app-shell flex min-h-screen flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex w-full max-w-2xl flex-1 flex-col">
        <header className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-2xl shadow-md shadow-[var(--lemon-glow)]">
            🍋
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--accent-dark)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-muted)]" aria-hidden />
            AI Mental Coach
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Mindful Coach
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            A bright, supportive space to talk through stress, motivation,
            habits, and confidence.
          </p>
        </header>

        <Chat />
      </div>
    </main>
  );
}
