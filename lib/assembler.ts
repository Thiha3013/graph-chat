// lib/assembler.ts
// Responsible for converting a ChatWindow's ordered cell IDs into a flat
// message array that gets sent directly to the LLM.
// This is the core invariant of the product: the model sees exactly what
// this function returns — no hidden history, no auto-context.
// Assembly order: system prompt → pinned cells → active cells.
// Cells marked "excluded" are skipped. Cells marked "minimized" use
// minimizedContent instead of the full content.

import { ChatWindow, MessageCell } from "@/components/types/core";

// The shape the LLM expects — role tells it who is speaking, content is the text.
// "system" = instructions, "user" = human, "assistant" = model's previous replies.
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

  const pinned: MessageCell[] = [];
  const active: MessageCell[] = [];

  for (const id of window.messageCellIds) {
    const cell = cellsById[id];
    if (!cell) continue;
    cell.isPinned ? pinned.push(cell) : active.push(cell);
  }

  for (const cell of pinned) {
    if (cell.cellMode === "excluded") continue;
    const content = cell.cellMode === "minimized" && cell.minimizedContent
      ? cell.minimizedContent
      : cell.content;
    messages.push({ role: cell.role, content });
  }

  for (const cell of active) {
    if (cell.cellMode === "excluded") continue;
    const content = cell.cellMode === "minimized" && cell.minimizedContent
      ? cell.minimizedContent
      : cell.content;
    messages.push({ role: cell.role, content });
  }

  return messages;
}
