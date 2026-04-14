"use client"; // client component (context hook use)

import { createContext, useContext } from "react"; // React context APIs
import { MessageCell, ChatWindow } from "@/components/types/core"; // your types

interface AppContextType {
  cells: Record<string, MessageCell>;
  windows: ChatWindow[];
  activeWindowId: string | null;
  addCell: (cell: MessageCell) => void;
  reorderActiveWindowCells: (fromId: string, toId: string) => void;
  addNewWindow: () => string; // creates a window, sets it as active, returns its id
}

export const AppContext = createContext<AppContextType>({
  cells: {}, // default empty
  windows: [], // default empty
  activeWindowId: null, // default none
  addCell: () => {},
  reorderActiveWindowCells: () => {},
  addNewWindow: () => "",
});

export const useApp = () => useContext(AppContext); // convenience hook
