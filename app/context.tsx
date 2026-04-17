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
});

export const useApp = () => useContext(AppContext);
