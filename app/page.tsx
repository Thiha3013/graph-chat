"use client";
import { useState } from "react";
import { MessageCell, CellCollection, ChatWindow } from "@/components/types/core";


export default function Home() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<MessageCell[]>([]);


  function handleSubmit() {
    setItems([...items, { id: crypto.randomUUID(), windowId: "active", role: "user", content: text, createdAt: Date.now() }]);
    setText("");
  }

  return (
    <div className="">

      

      {/* Cell Container */}
      <div className=" flex flex-col items-center w-full p-0.5 ">
        {items.map((item, i) => (
            <div key={i}
                 className="rounded-lg bg-[var(--border)] w-3/5 p-1 m-0.5 break-words whitespace-pre-wrap ">
                  {JSON.stringify(item)}
            </div>
          ))}
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
