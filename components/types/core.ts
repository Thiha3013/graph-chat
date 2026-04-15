/**
 * Core Data Contracts for Chatr
 *
 * DO NOT CHANGE AFTER MVP
 *
 * These immutable schemas define the fundamental data structures.
 * All other code must conform to these contracts.
 */

export interface ChatWindow {
  
  id: string; /** Unique identifier for the window */
  title: string;  /** Display title for the window */
  agentRole: string; /** Role of the AI agent (e.g., "assistant", "code-reviewer") */
  model: string; /** AI model identifier (e.g., "gpt-4", "claude-3") */
  systemPrompt: string; /** System prompt that defines the AI's behavior and context */
  messageCellIds: string[];  /** Ordered array of message cell IDs belonging to this window */
}

/**
 * MessageCell - Represents an individual message in a conversation
 *
 * DO NOT CHANGE AFTER MVP
 */
export interface MessageCell {

  id: string;   /** Unique identifier for the cell */
  windowId: string;  /** ID of the window this cell belongs to */
  role: "user" | "assistant"; /** Role of the message sender */
  content: string;  /** The actual message content */
  createdAt: number; /** Unix timestamp when the cell was created */
  importedFrom?: string; /** Collection name this cell was injected from, if any */
}

/**
 * CellCollection - Represents a saved collection/block of cells
 *
 * DO NOT CHANGE AFTER MVP
 */
export interface CellCollection {
  
  id: string; /** Unique identifier for the collection */
  name: string; /** Human-readable name for the collection */
  orderedCellIds: string[];  /** Ordered snapshot of cell IDs in this collection */
}
