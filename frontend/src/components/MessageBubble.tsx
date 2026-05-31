import type { Message } from "@/lib/api";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-enter flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] sm:text-[15px] ${
          isUser
            ? "rounded-br-md bg-[var(--user-bubble)] text-white"
            : "rounded-bl-md border border-[var(--border)] bg-[var(--coach-bubble)] text-[var(--text-primary)]"
        }`}
      >
        {!isUser && (
          <p className="mb-1 text-xs font-medium text-[var(--accent-dark)]">
            Coach
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
