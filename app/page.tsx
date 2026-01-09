"use client";

import { useState, useRef } from "react"; // hooks
import { useApp } from "./context"; // your context

export default function Home() {
  const [text, setText] = useState(""); // input text

  const { cells, windows, activeWindowId, addCell, reorderActiveWindowCells } = useApp(); // app state + actions
  const activeWindow = windows.find(w => w.id === activeWindowId); // current window

  const dragIdRef = useRef<string | null>(null); // which cell is being dragged
  const overIdRef = useRef<string | null>(null); // which cell we're currently "over"
  const elByIdRef = useRef<Record<string, HTMLDivElement | null>>({}); // dom nodes by id

  const [, forceRerender] = useState(0); // tiny hack to refresh highlight without real state

  function startDrag(id: string, e: React.PointerEvent) {
    dragIdRef.current = id; // set dragged id
    overIdRef.current = null; // reset target
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); // keep receiving moves
    forceRerender(n => n + 1); // refresh UI
  }

  function stopDrag() {
    const dragId = dragIdRef.current; // dragged
    const overId = overIdRef.current; // target
    if (dragId && overId) reorderActiveWindowCells(dragId, overId); // commit reorder once (DROP)
    dragIdRef.current = null; // clear drag
    overIdRef.current = null; // clear target
    forceRerender(n => n + 1); // refresh UI
  }

  function onMove(e: React.PointerEvent) {
    const dragId = dragIdRef.current; // dragged id
    const ids = activeWindow?.messageCellIds; // current order
    if (!dragId || !ids) return; // not dragging / no window

    const y = e.clientY; // pointer y
    let bestId: string | null = null; // closest item id
    let bestDist = Infinity; // closest distance

    for (const id of ids) {
      if (id === dragId) continue; // ignore dragged item
      const el = elByIdRef.current[id]; // dom node
      if (!el) continue; // not mounted

      const r = el.getBoundingClientRect(); // position
      const midY = r.top + r.height / 2; // center y
      const dist = Math.abs(y - midY); // distance to center

      if (dist < bestDist) {
        bestDist = dist; // update best
        bestId = id; // update best id
      }
    }

    if (overIdRef.current !== bestId) {
      overIdRef.current = bestId; // update hover target
      forceRerender(n => n + 1); // refresh highlight
    }
  }

  function handleSubmit() {
    if (!activeWindowId || !text.trim()) return; // guard
    addCell({
      id: crypto.randomUUID(), // new id
      windowId: activeWindowId, // active window
      role: "user", // role
      content: text, // content
      createdAt: Date.now(), // timestamp
    });
    setText(""); // clear input
  }

  const draggingId = dragIdRef.current; // read refs for render
  const overId = overIdRef.current; // read refs for render

  return (
    <div className="">
      {/* Cell Container */}
      <div className="flex flex-col items-center w-full p-0.5" onPointerMove={onMove} onPointerUp={stopDrag}>
        {activeWindow?.messageCellIds.map(id => {
          const cell = cells[id]; // get cell
          if (!cell) return null; // safety

          const isDrag = id === draggingId; // is dragged
          const isOver = id === overId; // is drop target

          return (
            <div
              key={id} // stable key
              ref={el => { elByIdRef.current[id] = el; }} // store dom node
              onPointerDown={(e) => startDrag(id, e)} // start drag
              className={[
                "border p-2 mb-2 cursor-move select-none w-3/5", // base
                isDrag ? "opacity-50" : "", // dragged style
                isOver ? "outline outline-2" : "", // target highlight
              ].join(" ")} // join classes
            >
              {cell.content} {/* show content */}
            </div>
          );
        })}
      </div>

      {/*Text input + Button*/}
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <div className="bg-[var(--highlight)] flex items-center rounded-4xl p-2 pl-16 gap-0 w-3/5">
          <input className="flex-1 h-10 px-2" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="px-2">
            <button className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center" onClick={handleSubmit}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
