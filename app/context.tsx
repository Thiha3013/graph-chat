"use client"; // client component (context hook use)

import { createContext, useContext } from "react"; // React context APIs
import { MessageCell, ChatWindow } from "@/components/types/core"; // your types

interface AppContextType {
  cells: Record<string, MessageCell>; // cell storage by id
  windows: ChatWindow[]; // all chat windows
  activeWindowId: string | null; // current window id
  addCell: (cell: MessageCell) => void; // append a cell to active window
  reorderActiveWindowCells: (fromId: string, toId: string) => void; // reorder ids in active window
}

export const AppContext = createContext<AppContextType>({
  cells: {}, // default empty
  windows: [], // default empty
  activeWindowId: null, // default none
  addCell: () => {}, // default no-op
  reorderActiveWindowCells: () => {}, // default no-op
});

export const useApp = () => useContext(AppContext); // convenience hook
