"use client";
import { createContext, useContext } from "react";
import { MessageCell, ChatWindow } from "@/components/types/core";

interface AppContextType {
  cells: Record<string, MessageCell>;
  windows: ChatWindow[];
  activeWindowId: string | null;
  addCell: (cell: MessageCell) => void;
}

export const AppContext = createContext<AppContextType>({
  cells: {},
  windows: [],
  activeWindowId: null,
  addCell: () => {},
});

export const useApp = () => useContext(AppContext);
