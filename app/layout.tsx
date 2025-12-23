"use client";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MessageCell, CellCollection, ChatWindow } from "@/components/types/core";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({children}: {children: React.ReactNode;}){
  const [items, setItems] = useState<ChatWindow[]>([]);

  

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
              <button onClick={() => setItems([...items, {
                id: crypto.randomUUID(),
                title: "New Chat",
                agentRole: "assistant",
                model: "default",
                systemPrompt: "",
                messageCellIds: []
              }])}>
                add new chat
              </button>
            </div>

            <div className=" flex flex-col items-center w-full p-0.5 ">
              {items.map((item, i) => (
                  <div key={i}
                      className="rounded-lg bg-[var(--border)] w-4/5 p-1 m-0.5 ">new chat id:{item.id}</div>
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
            {children}

          </div>

        </div>
      </body>
    </html>
  );
}
