// lib/reorder.ts
// Pure utility functions for reordering arrays by index or by item ID.
// Used by reorderActiveWindowCells in layout.tsx to move cells around
// without mutating the original array.
// No state, no side effects — input in, new array out.
export function moveIndex<T>(arr: T[], from: number, to: number): T[] { // move item by index
    if (from === to) return arr; // no-op
    if (from < 0 || to < 0) return arr; // guard
    if (from >= arr.length || to >= arr.length) return arr; // guard
  
    const next = [...arr]; // copy
    const [moved] = next.splice(from, 1); // remove
    next.splice(to, 0, moved); // insert
    return next; // new array
  }
  
  export function moveId(ids: string[], fromId: string, toId: string): string[] { // move item by id
    if (fromId === toId) return ids; // no-op
    const from = ids.indexOf(fromId); // find dragged
    const to = ids.indexOf(toId); // find target
    if (from === -1 || to === -1) return ids; // guard
    return moveIndex(ids, from, to); // reuse
  }

  
  