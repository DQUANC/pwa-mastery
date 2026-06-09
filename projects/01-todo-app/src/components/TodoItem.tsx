import { useState, KeyboardEvent } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
}

const SYNC_STATUS_LABELS: Record<Todo['syncStatus'], string> = {
  synced: '',
  pending: 'Pending sync',
  failed: 'Sync failed',
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const commitEdit = async () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      await onUpdate(todo.id, trimmed);
    } else {
      setEditTitle(todo.title);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') void commitEdit();
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setEditing(false);
    }
  };

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
        todo.completed ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'
      }`}
      data-testid="todo-item"
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => void onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-500 focus:ring-blue-200"
      />

      {/* Title — editable on double-click */}
      {editing ? (
        <input
          autoFocus
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => void commitEdit()}
          onKeyDown={handleKeyDown}
          aria-label="Edit todo title"
          className="flex-1 rounded border border-blue-300 px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      ) : (
        <span
          role="button"
          tabIndex={0}
          onDoubleClick={() => setEditing(true)}
          onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
          className={`flex-1 cursor-text select-none text-sm ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
          title="Double-click to edit"
        >
          {todo.title}
        </span>
      )}

      {/* Sync status indicator */}
      {todo.syncStatus !== 'synced' && (
        <span
          aria-label={SYNC_STATUS_LABELS[todo.syncStatus]}
          title={SYNC_STATUS_LABELS[todo.syncStatus]}
          className={`text-xs ${todo.syncStatus === 'failed' ? 'text-red-500' : 'text-yellow-500'}`}
        >
          {todo.syncStatus === 'pending' ? '↑' : '!'}
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={() => void onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        ✕
      </button>
    </li>
  );
}
