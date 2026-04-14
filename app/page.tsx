"use client";

import { useState, useRef } from "react";
import { useApp } from "./context";
import { MessageCell } from "@/components/types/core";
import { assembleContext } from "@/lib/context";
import { callLLM } from "@/lib/llm";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const { cells, windows, activeWindowId, addCell, reorderActiveWindowCells } = useApp();
  const activeWindow = windows.find(w => w.id === activeWindowId);

  // Refs track drag state without triggering re-renders on every pointer move.
  const dragIdRef = useRef<string | null>(null);
  const overIdRef = useRef<string | null>(null);
  const elByIdRef = useRef<Record<string, HTMLDivElement | null>>({});

  // Incrementing this forces a re-render to reflect updated ref values in the UI.
  const [, forceRerender] = useState(0);

  function startDrag(id: string, e: React.PointerEvent) {
    dragIdRef.current = id;
    overIdRef.current = null;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); // keeps pointer events on this element even if cursor leaves it
    forceRerender(n => n + 1);
  }

  function stopDrag() {
    const dragId = dragIdRef.current;
    const overId = overIdRef.current;
    if (dragId && overId) reorderActiveWindowCells(dragId, overId);
    dragIdRef.current = null;
    overIdRef.current = null;
    forceRerender(n => n + 1);
  }

  // Finds the cell whose vertical center is closest to the pointer — that becomes the drop target.
  function onMove(e: React.PointerEvent) {
    const dragId = dragIdRef.current;
    const ids = activeWindow?.messageCellIds;
    if (!dragId || !ids) return;

    const y = e.clientY;
    let bestId: string | null = null;
    let bestDist = Infinity;

    for (const id of ids) {
      if (id === dragId) continue;
      const el = elByIdRef.current[id];
      if (!el) continue;

      const r = el.getBoundingClientRect();
      const dist = Math.abs(y - (r.top + r.height / 2));

      if (dist < bestDist) {
        bestDist = dist;
        bestId = id;
      }
    }

    if (overIdRef.current !== bestId) {
      overIdRef.current = bestId;
      forceRerender(n => n + 1);
    }
  }

  async function handleSubmit() {
    if (!activeWindowId || !activeWindow || !text.trim() || loading) return;

    const userCell: MessageCell = {
      id: crypto.randomUUID(),
      windowId: activeWindowId,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    addCell(userCell);
    setText("");
    setLoading(true);

    // React state hasn't flushed yet, so we build the updated context manually
    // rather than reading from stale state.
    const updatedCells = { ...cells, [userCell.id]: userCell };
    const updatedWindow = { ...activeWindow, messageCellIds: [...activeWindow.messageCellIds, userCell.id] };
    const messages = assembleContext(updatedWindow, updatedCells);

    const content = await callLLM(messages);

    addCell({
      id: crypto.randomUUID(),
      windowId: activeWindowId,
      role: "assistant",
      content,
      createdAt: Date.now(),
    });

    setLoading(false);
  }

  const draggingId = dragIdRef.current;
  const overId = overIdRef.current;

  return (
    <div className="">
      <div className="flex flex-col items-center w-full p-0.5" onPointerMove={onMove} onPointerUp={stopDrag}>
        {activeWindow?.messageCellIds?.map(id => {
          const cell = cells[id];
          if (!cell) return null;

          const isDrag = id === draggingId;
          const isOver = id === overId;

          return (
            <div
              key={id}
              ref={el => { elByIdRef.current[id] = el; }}
              onPointerDown={(e) => startDrag(id, e)}
              className={[
                "border p-2 mb-2 cursor-move select-none w-3/5",
                isDrag ? "opacity-50" : "",
                isOver ? "outline outline-2" : "",
              ].join(" ")}
            >
              {cell.content}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <div className="bg-[var(--highlight)] flex items-center rounded-4xl p-2 pl-16 gap-0 w-3/5">
          <input className="flex-1 h-10 px-2" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="px-2">
            <button
              className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "…" : "→"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
