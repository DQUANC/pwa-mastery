import { useState, FormEvent } from 'react';
import { CreateTodoInput } from '../types/todo';

interface AddTodoProps {
  onAdd: (input: CreateTodoInput) => Promise<void>;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await onAdd({ title: trimmed });
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        disabled={submitting}
        aria-label="New todo title"
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={submitting || title.trim().length === 0}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
