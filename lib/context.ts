import { ChatWindow, MessageCell } from "@/components/types/core";

// The shape the LLM expects — role tells it who is speaking, content is the text.
// "system" = instructions, "user" = human, "assistant" = model's previous replies.
export interface ContextMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Converts a window's ordered cell IDs into a flat message array ready for the LLM.
// Order is strictly respected — reordering cells changes what the model sees.
// cellsById is a Record (dictionary) so we can look up any cell by its id instantly.
export function assembleContext(
  window: ChatWindow,
  cellsById: Record<string, MessageCell>
): ContextMessage[] {
  const messages: ContextMessage[] = [];

  if (window.systemPrompt) {
    messages.push({ role: "system", content: window.systemPrompt }); // always goes first
  }

  const pinned: MessageCell[] = [];
  const active: MessageCell[] = [];

  for (const id of window.messageCellIds) {
    const cell = cellsById[id];
    if (!cell) continue;
    cell.isPinned ? pinned.push(cell) : active.push(cell);
  }

  for (const cell of pinned) {
    messages.push({ role: cell.role, content: cell.content });
  }

  for (const cell of active) {
    messages.push({ role: cell.role, content: cell.content });
  }


  return messages;
}
