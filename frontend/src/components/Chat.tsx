"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import { Message, sendChatMessage } from "@/lib/api";

const WELCOME_MESSAGE =
  "Hey there — welcome! I'm glad you're here. This is a calm space to talk through whatever's on your mind. What would you like to chat about today?";

const STARTER_PROMPTS = [
  "I'm feeling overwhelmed today.",
  "Help me build a morning routine.",
  "How do I stay motivated when progress feels slow?",
];

function TypingIndicator() {
  return (
    <div className="message-enter flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--border)] bg-[var(--coach-bubble)] px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-dark)]" />
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-dark)]" />
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-dark)]" />
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const showStarterPrompts =
    messages.length === 1 && messages[0].id === "welcome";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  function handlePromptClick(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-[var(--lemon-glow)]">
      <div
        className="chat-scroll flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-5"
        style={{ minHeight: "320px", maxHeight: "calc(100vh - 300px)" }}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {showStarterPrompts && !isLoading && (
          <div className="message-enter flex flex-wrap justify-center gap-2 px-1 pt-1">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="prompt-pill rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] sm:text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div
          className="mx-4 mb-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-[var(--error)] sm:mx-5"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-5"
      >
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind…"
            rows={1}
            disabled={isLoading}
            aria-label="Your message"
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)]/40 disabled:opacity-60 sm:text-[15px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-muted)] px-4 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--text-secondary)]">
          Press Enter to send · Shift+Enter for a new line
        </p>
      </form>
    </div>
  );
}
