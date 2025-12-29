"use client";
import { useState } from "react";
import { useApp } from "./context";


export default function Home() {
  const [text, setText] = useState("");
  const { cells, windows, activeWindowId, addCell } = useApp();
  const activeWindow = windows.find(w => w.id === activeWindowId);




  function handleSubmit() {
    if (!activeWindowId) return;

    addCell({
      id: crypto.randomUUID(),
      windowId: activeWindowId,
      role: "user",
      content: text,
      createdAt: Date.now(),
    });
    
    setText("");
  }

  return (
    <div className="">

      

      {/* Cell Container */}
      <div className=" flex flex-col items-center w-full p-0.5 ">
      {activeWindow?.messageCellIds.map(id => {
          const cell = cells[id];
          if (!cell) return null;
          return <div key={id}>{cell.content}</div>;
        })}
      </div>

      {/*Text input + Button*/}
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <div className="bg-[var(--highlight)] flex items-center rounded-4xl p-2 pl-16 gap-0 w-3/5">

          <input
            className="flex-1 h-10 px-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="px-2">
          <button
            className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center "
            onClick={handleSubmit}
          >
            →
          </button>
          </div>
        </div>
      </div>

    </div>
  );
}
