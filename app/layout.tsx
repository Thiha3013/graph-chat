"use client";
import "./globals.css";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCell, ChatWindow, CellCollection } from "@/components/types/core";
import { moveId } from "@/lib/reorder"; // pure reorder helper
import { AppContext } from "./context";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({children}: {children: React.ReactNode;}){
  const [windows, setWindows] = useState<ChatWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [cells, setCells] = useState<Record<string, MessageCell>>({});
  const [collections, setCollections] = useState<CellCollection[]>([]);

  function addCell(cell: MessageCell) {
    setCells(prev => ({ ...prev, [cell.id]: cell }));
    setWindows(prev => prev.map(w => //loop through prev(the array that contains all windows)
        w.id === activeWindowId ? { ...w, messageCellIds: [...w.messageCellIds, cell.id] } : w 
      )
    );
  }

  function reorderActiveWindowCells(fromId: string, toId: string) { // reorder ids in active window
    if (!activeWindowId) return; // no active window
    if (fromId === toId) return; // no-op
  
    setWindows(prev => // update windows array
      prev.map(w => { // scan each window
        if (w.id !== activeWindowId) return w; // only active window changes
        return { ...w, messageCellIds: moveId(w.messageCellIds, fromId, toId) }; // reorder ids
      })
    );
  }  

  function saveCollection(name: string, orderedCellIds: string[]) {
    const collection: CellCollection = {
      id: crypto.randomUUID(),
      name,
      orderedCellIds,
    };
    setCollections(prev => [...prev, collection]);
  }

  function addNewWindow(): string {
    const id = crypto.randomUUID();
    setWindows(prev => [...prev, {
      id,
      title: "New Chat",
      agentRole: "assistant",
      model: "default",
      systemPrompt: "",
      messageCellIds: []
    }]);
    setActiveWindowId(id);
    return id; // caller may need the id immediately (before state flushes)
  }

  

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[var(--bg-light)] h-screen`}>
        <div className="flex h-full">
          <div className="w-1/5 h-full bg-[var(--bg)] flex flex-col items-center">

            {/* Header */}
            <div className="bg-[var(--bg)] w-full h-12 flex justify-center p-2">
            this is sidebar header
            </div>

            <div className="w-full flex justify-center ">
              <button onClick={() => addNewWindow()
              }>
                add new chat
              </button>
            </div>

            <div className=" flex flex-col items-center w-full p-0.5 ">
              {windows.map((window) => (
                  <div key={window.id}
                      onClick={() => setActiveWindowId(window.id)}
                      className={[
                        "rounded-lg w-4/5 p-1 m-0.5 cursor-pointer",
                        window.id === activeWindowId ? "bg-[var(--primary)] text-white" : "bg-[var(--border)]"
                      ].join(" ")}>
                        {window.title}
                  </div>
                ))}
            </div>

          </div>

          <div className="w-4/5 h-full relative">

            {/* Header */}
            <div className="bg-[var(--border)] w-full h-12 flex-1 flex items-center justify-center">
              <div>
              Title 
              </div>
            </div>

            {/* page.js */}
            <AppContext.Provider value={{ cells, windows, activeWindowId, collections, addCell, reorderActiveWindowCells, addNewWindow, saveCollection }}>
              {children}
            </AppContext.Provider>

          </div>

        </div>
      </body>
    </html>
  );
}
