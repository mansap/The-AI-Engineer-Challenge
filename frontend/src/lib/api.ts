export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export interface ChatErrorResponse {
  detail?: string | { msg?: string; loc?: string[] }[];
}

function formatErrorDetail(detail: ChatErrorResponse["detail"]): string | null {
  if (!detail) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg ?? JSON.stringify(item)).join("; ");
  }
  return null;
}

/** POST a user message to /api/chat and return the coach reply. */
export async function sendChatMessage(message: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw new Error(
      "Could not reach the server. Is the backend running on port 8000?"
    );
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const errorBody = (await response.json()) as ChatErrorResponse;
      detail = formatErrorDetail(errorBody.detail) ?? detail;
    } catch {
      /* use status-based message */
    }
    throw new Error(detail);
  }

  const data = (await response.json()) as ChatResponse;
  const reply = data.reply?.trim();
  if (!reply) {
    throw new Error("The coach returned an empty response. Please try again.");
  }
  return reply;
}
