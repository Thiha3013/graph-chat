/**
 * Core Data Contracts for Chatr
 *
 * DO NOT CHANGE AFTER MVP
 *
 * These immutable schemas define the fundamental data structures.
 * All other code must conform to these contracts.
 */

export interface ChatWindow {
  id: string;
  title: string;
  agentRole: string;
  model: string;
  systemPrompt: string;
  messageCellIds: string[];        /** Ordered array of native message cell IDs */
  importedContextRefs: string[];   /** IDs of ImportedContextRef objects attached to this window */
  createdAt: number;
  updatedAt: number;
}

/**
 * MessageCell - Represents an individual message in a conversation
 *
 * DO NOT CHANGE AFTER MVP
 */
export interface MessageCell {
  id: string;
  windowId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  importedFrom?: string; /** Collection name this cell was injected from, if any */
}

/**
 * ImportedContextRef - A snapshot of cells imported from another window.
 * Tracked separately from messageCellIds so imported context never silently
 * pollutes a window's native timeline.
 */
export interface ImportedContextRef {
  id: string;
  targetWindowId: string;   /** The window this ref is attached to */
  sourceWindowId: string;   /** The window the cells came from */
  sourceCellIds: string[];  /** Ordered snapshot of cell IDs from the source */
  label: string;            /** Human-readable label shown in the UI */
  createdAt: number;
}

/**
 * CellCollection - Represents a saved collection/block of cells
 *
 * DO NOT CHANGE AFTER MVP
 */
export interface CellCollection {
  id: string;
  name: string;
  orderedCellIds: string[];
}
