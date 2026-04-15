"use client";
import "./globals.css";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCell, ChatWindow, CellCollection, ImportedContextRef } from "@/components/types/core";
import { moveId } from "@/lib/reorder";
import { AppContext } from "./context";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [windowsById, setWindowsById] = useState<Record<string, ChatWindow>>({});
  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const [cellsById, setCellsById] = useState<Record<string, MessageCell>>({});
  const [importedRefsById] = useState<Record<string, ImportedContextRef>>({});
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [collections, setCollections] = useState<CellCollection[]>([]);

  function addCell(cell: MessageCell) {
    if (!activeWindowId) return;
    setCellsById(prev => ({ ...prev, [cell.id]: cell }));
    setWindowsById(prev => {
      const w = prev[activeWindowId];
      if (!w) return prev;
      return { ...prev, [activeWindowId]: { ...w, messageCellIds: [...w.messageCellIds, cell.id], updatedAt: Date.now() } };
    });
  }

  function reorderActiveWindowCells(fromId: string, toId: string) {
    if (!activeWindowId || fromId === toId) return;
    setWindowsById(prev => {
      const w = prev[activeWindowId];
      if (!w) return prev;
      return { ...prev, [activeWindowId]: { ...w, messageCellIds: moveId(w.messageCellIds, fromId, toId) } };
    });
  }

  function saveCollection(name: string, orderedCellIds: string[]) {
    const collection: CellCollection = { id: crypto.randomUUID(), name, orderedCellIds };
    setCollections(prev => [...prev, collection]);
  }

  function injectCollection(collectionId: string) {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection || !activeWindowId) return;

    const newCells: MessageCell[] = [];
    const newIds: string[] = [];

    for (const originalId of collection.orderedCellIds) {
      const original = cellsById[originalId];
      if (!original) continue;
      const duplicate: MessageCell = {
        ...original,
        id: crypto.randomUUID(),
        windowId: activeWindowId,
        importedFrom: collection.name,
      };
      newCells.push(duplicate);
      newIds.push(duplicate.id);
    }

    setCellsById(prev => {
      const next = { ...prev };
      for (const cell of newCells) next[cell.id] = cell;
      return next;
    });

    setWindowsById(prev => {
      const w = prev[activeWindowId];
      if (!w) return prev;
      return { ...prev, [activeWindowId]: { ...w, messageCellIds: [...w.messageCellIds, ...newIds] } };
    });
  }

  function addNewWindow(): string {
    const id = crypto.randomUUID();
    const newWindow: ChatWindow = {
      id,
      title: "New Chat",
      agentRole: "assistant",
      model: "default",
      systemPrompt: "",
      messageCellIds: [],
      importedContextRefs: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setWindowsById(prev => ({ ...prev, [id]: newWindow }));
    setWindowOrder(prev => [...prev, id]);
    setActiveWindowId(id);
    return id;
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[var(--bg-light)] h-screen`}>
        <div className="flex h-full">
          <div className="w-1/5 h-full bg-[var(--bg)] flex flex-col items-center">

            <div className="bg-[var(--bg)] w-full h-12 flex justify-center p-2">
              this is sidebar header
            </div>

            <div className="w-full flex justify-center">
              <button onClick={() => addNewWindow()}>add new chat</button>
            </div>

            <div className="flex flex-col items-center w-full p-0.5">
              {windowOrder.map(id => {
                const w = windowsById[id];
                if (!w) return null;
                return (
                  <div
                    key={id}
                    onClick={() => setActiveWindowId(id)}
                    className={[
                      "rounded-lg w-4/5 p-1 m-0.5 cursor-pointer",
                      id === activeWindowId ? "bg-[var(--primary)] text-white" : "bg-[var(--border)]"
                    ].join(" ")}
                  >
                    {w.title}
                  </div>
                );
              })}
            </div>

          </div>

          <div className="w-4/5 h-full relative">
            <div className="bg-[var(--border)] w-full h-12 flex-1 flex items-center justify-center">
              <div>Title</div>
            </div>

            <AppContext.Provider value={{ windowsById, windowOrder, cellsById, importedRefsById, activeWindowId, collections, addCell, reorderActiveWindowCells, addNewWindow, saveCollection, injectCollection }}>
              {children}
            </AppContext.Provider>
          </div>

        </div>
      </body>
    </html>
  );
}
