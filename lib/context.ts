import { ChatWindow, MessageCell } from "@/components/types/core";

export interface ContextMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function assembleContext(
  window: ChatWindow,
  cellsById: Record<string, MessageCell>
): ContextMessage[] {
  const messages: ContextMessage[] = [];

  if (window.systemPrompt) {
    messages.push({ role: "system", content: window.systemPrompt });
  }

  for (const id of window.messageCellIds) {
    const cell = cellsById[id];
    if (!cell) continue; // skip missing cells
    messages.push({ role: cell.role, content: cell.content });
  }

  return messages;
}
