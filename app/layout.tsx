"use client";
import "./globals.css";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCell, ChatWindow } from "@/components/types/core";
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
  const [windows, setWindows] = useState<ChatWindow[]>([]); // Array of windows
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [cells, setCells] = useState<Record<string, MessageCell>>({}); // Record or Dictionary of cells

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
              {windows.map((window, i) => (
                  <div key={i}
                      className="rounded-lg bg-[var(--border)] w-4/5 p-1 m-0.5 break-words whitespace-pre-wrap ">
                        new chat id:{JSON.stringify(window)}
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
            <AppContext.Provider value={{ cells, windows, activeWindowId, addCell, reorderActiveWindowCells, addNewWindow }}>
              {children}
            </AppContext.Provider>

          </div>

        </div>
      </body>
    </html>
  );
}
