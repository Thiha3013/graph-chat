// app/context.tsx
// Defines the global React context (AppContext) that shares workspace state
// across the entire component tree without prop drilling.
// AppContextType declares every piece of state and every action function
// that child components can access via the useApp() hook.
// The actual state and function implementations live in app/layout.tsx —
// this file only defines the shape and provides the default (empty) values.
"use client";

import { createContext, useContext } from "react";
import { MessageCell, ChatWindow, CellCollection, ImportedContextRef } from "@/components/types/core";

interface AppContextType {
  windowsById: Record<string, ChatWindow>;
  windowOrder: string[];
  cellsById: Record<string, MessageCell>;
  importedRefsById: Record<string, ImportedContextRef>;
  activeWindowId: string | null;
  collections: CellCollection[];
  addCell: (cell: MessageCell) => void;
  reorderActiveWindowCells: (fromId: string, toId: string) => void;
  addNewWindow: () => string;
  renameWindow: (id: string, title: string) => void;
  deleteWindow: (id: string) => void;
  saveCollection: (name: string, orderedCellIds: string[]) => void;
  injectCollection: (collectionId: string) => void;
  togglePin: (id: string) => void;
  setCellMode: (id: string, mode: "full" | "minimized" | "excluded") => void;

}

export const AppContext = createContext<AppContextType>({
  windowsById: {},
  windowOrder: [],
  cellsById: {},
  importedRefsById: {},
  activeWindowId: null,
  collections: [],
  addCell: () => {},
  reorderActiveWindowCells: () => {},
  addNewWindow: () => "",
  renameWindow: () => {},
  deleteWindow: () => {},
  saveCollection: () => {},
  injectCollection: () => {},
  togglePin: () => {},
  setCellMode: () => {},
});

export const useApp = () => useContext(AppContext);
