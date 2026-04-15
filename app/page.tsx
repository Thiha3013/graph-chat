"use client";

import { useState, useRef } from "react";
import { useApp } from "./context";
import { MessageCell } from "@/components/types/core";
import { assembleContext } from "@/lib/context";
import { callLLM } from "@/lib/llm";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Set of selected cell IDs. Set is like an array but has no duplicates
  // and checking/adding/removing by value is faster.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [collectionName, setCollectionName] = useState("");

  const { cells, windows, activeWindowId, collections, addCell, reorderActiveWindowCells, addNewWindow, saveCollection, injectCollection } = useApp();
  const activeWindow = windows.find(w => w.id === activeWindowId);

  // Refs track drag state without triggering re-renders on every pointer move.
  const dragIdRef = useRef<string | null>(null);
  const overIdRef = useRef<string | null>(null);
  const elByIdRef = useRef<Record<string, HTMLDivElement | null>>({});

  // Incrementing this forces a re-render to reflect updated ref values in the UI.
  const [, forceRerender] = useState(0);

  function toggleSelect(id: string) {
    // Sets are mutable but useState needs a new reference to trigger a re-render,
    // so we copy the Set before modifying it.
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSaveCollection() {
    if (!collectionName.trim() || selectedIds.size === 0) return;

    // Filter messageCellIds down to only selected ones, preserving window order.
    const orderedCellIds = (activeWindow?.messageCellIds ?? []).filter(id => selectedIds.has(id));

    saveCollection(collectionName.trim(), orderedCellIds);
    setSelectedIds(new Set());
    setCollectionName("");
  }

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
    if (!text.trim() || loading) return;

    // If no window exists yet, create one before submitting.
    // addNewWindow returns the new id immediately since state won't have flushed.
    const windowId = activeWindowId ?? addNewWindow();
    const currentWindow = activeWindow ?? { id: windowId, title: "New Chat", agentRole: "assistant", model: "default", systemPrompt: "", messageCellIds: [] };

    const userCell: MessageCell = {
      id: crypto.randomUUID(),
      windowId,
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
    const updatedWindow = { ...currentWindow, messageCellIds: [...currentWindow.messageCellIds, userCell.id] };
    const messages = assembleContext(updatedWindow, updatedCells);

    const content = await callLLM(messages);

    addCell({
      id: crypto.randomUUID(),
      windowId,
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
      {/* Collection list — always visible at top when collections exist */}
      {collections.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center p-2 border-b">
          {collections.map(c => (
            <button
              key={c.id}
              onClick={() => injectCollection(c.id)}
              className="text-xs border px-2 py-1 rounded hover:bg-[var(--highlight)]"
            >
              + {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Save bar — only visible when at least one cell is selected */}
      {selectedIds.size > 0 && (
        <div className="flex justify-center gap-2 p-2">
          <input
            className="border px-2 py-1"
            placeholder="Collection name"
            value={collectionName}
            onChange={e => setCollectionName(e.target.value)}
          />
          <button className="bg-[var(--primary)] text-white px-3 py-1" onClick={handleSaveCollection}>
            Save ({selectedIds.size})
          </button>
        </div>
      )}

      <div className="flex flex-col items-center w-full p-0.5" onPointerMove={onMove} onPointerUp={stopDrag}>
        {activeWindow?.messageCellIds?.map(id => {
          const cell = cells[id];
          if (!cell) return null;

          const isDrag = id === draggingId;
          const isOver = id === overId;
          const isSelected = selectedIds.has(id);

          return (
            <div
              key={id}
              ref={el => { elByIdRef.current[id] = el; }}
              onPointerDown={(e) => startDrag(id, e)}
              className={[
                "border p-2 mb-2 cursor-move select-none w-3/5 flex flex-col gap-1",
                isDrag ? "opacity-50" : "",
                isOver ? "outline outline-2" : "",
                isSelected ? "bg-[var(--highlight)]" : "",
              ].join(" ")}
            >
              {/* Label injected cells with the collection they came from */}
              {cell.importedFrom && (
                <span className="text-xs opacity-50">↩ {cell.importedFrom}</span>
              )}
              <div className="flex items-center gap-2">
                {/* stopPropagation prevents the checkbox click from also starting a drag */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(id)}
                  onPointerDown={e => e.stopPropagation()}
                />
                {cell.content}
              </div>
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
