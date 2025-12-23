export const schema = `
CREATE TABLE IF NOT EXISTS chat_windows (
  id TEXT PRIMARY KEY,
  title TEXT,
  agent_role TEXT,
  model TEXT,
  system_prompt TEXT
);

CREATE TABLE IF NOT EXISTS message_cells (
  id TEXT PRIMARY KEY,
  window_id TEXT,
  role TEXT,
  content TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS window_cell_order (
  window_id TEXT,
  cell_id TEXT,
  position INTEGER
);

CREATE TABLE IF NOT EXISTS cell_collections (
  id TEXT PRIMARY KEY,
  name TEXT
);

CREATE TABLE IF NOT EXISTS collection_cell_order (
  collection_id TEXT,
  cell_id TEXT,
  position INTEGER
);
`;
