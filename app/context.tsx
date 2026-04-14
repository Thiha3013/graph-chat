"use client"; // client component (context hook use)

import { createContext, useContext } from "react"; // React context APIs
import { MessageCell, ChatWindow, CellCollection } from "@/components/types/core";

interface AppContextType {
  cells: Record<string, MessageCell>;
  windows: ChatWindow[];
  activeWindowId: string | null;
  collections: CellCollection[];
  addCell: (cell: MessageCell) => void;
  reorderActiveWindowCells: (fromId: string, toId: string) => void;
  addNewWindow: () => string;
  saveCollection: (name: string, orderedCellIds: string[]) => void;
}

export const AppContext = createContext<AppContextType>({
  cells: {},
  windows: [],
  activeWindowId: null,
  collections: [],
  addCell: () => {},
  reorderActiveWindowCells: () => {},
  addNewWindow: () => "",
  saveCollection: () => {},
});

export const useApp = () => useContext(AppContext); // convenience hook
