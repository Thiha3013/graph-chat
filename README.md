# Graphlow — Modular LLM Chat Interface

## Overview

Graphlow is a modular LLM chat interface that treats each request/response as a reusable, reorderable "cell." Instead of a fixed linear history, conversations are assembled from discrete blocks — giving you full control over what context is sent to the model before every response.

Think of it less like a chatbot and more like a **chat IDE**.

---

## Key Features

- **Cell-based conversations** — every message is an independent, reusable block
- **Reorderable context** — drag cells into any order before sending; the model sees exactly that
- **Multi-window workspace** — independent chat instances with isolated state
- **Saved collections** — select and name a set of cells, inject them into any window later
- **Deterministic context assembly** — no hidden memory, no auto-history, no implicit context
- **Local LLM support** — runs against LM Studio out of the box

---

## How It Works

1. Create a chat window
2. Send messages — each is stored as an individual cell
3. Reorder cells to define the exact context the model will receive
4. Optionally save a selection of cells as a named collection
5. Inject saved collections into any window, preserving order
6. The model responds based strictly on the assembled context

---

## Tech Stack

- **Frontend:** Next.js 16 + React 19
- **Styling:** Tailwind CSS v4
- **State:** React Context API
- **LLM:** LM Studio (local) via OpenAI-compatible API
- **Storage:** SQLite *(schema drafted, persistence not yet connected)*

---

## Getting Started

```bash
npm install
npm run dev
```

Requires [LM Studio](https://lmstudio.ai) running locally with a model loaded and the local server started on `http://127.0.0.1:1234`.

---

## Design Principles

- **User-controlled context** — the model sees only what you explicitly order
- **Deterministic behavior** — same order always produces the same input
- **Isolation by default** — windows do not share state implicitly
- **Explicit sharing** — all cross-window context is user-triggered
- **Modularity** — conversations are composable and reusable

---

## Current Status

Core MVP is functional:

- Cell-based conversation system with drag-to-reorder
- Multi-window workspace with isolated context
- Saved and injectable cell collections
- Local LLM connected and responding

In progress:

- Cross-window context import UI
- Agent roles and per-window model configuration
- Persistence layer (SQLite)
- Streaming responses
