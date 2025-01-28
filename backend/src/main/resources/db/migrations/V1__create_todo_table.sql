CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    category TEXT NOT NULL DEFAULT 'none',
    due_date DATETIME,
    completed BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todo_due_date ON todos(due_date);

CREATE TRIGGER IF NOT EXISTS update_todo_timestamp
AFTER UPDATE ON todos
BEGIN
    UPDATE todos SET updated_at = DATETIME('now') WHERE id = NEW.id;
END;
