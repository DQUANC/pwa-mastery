/**
 * Tests for the TodoList component.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoList } from '../components/TodoList';
import { Todo } from '../types/todo';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    title: 'Test Todo',
    completed: false,
    syncStatus: 'synced',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('TodoList', () => {
  it('renders an empty state message when no todos exist', () => {
    render(
      <TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} onUpdate={jest.fn()} />,
    );

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('renders all todos', () => {
    const todos = [
      makeTodo({ title: 'First task' }),
      makeTodo({ title: 'Second task' }),
      makeTodo({ title: 'Third task' }),
    ];

    render(
      <TodoList todos={todos} onToggle={jest.fn()} onDelete={jest.fn()} onUpdate={jest.fn()} />,
    );

    expect(screen.getAllByTestId('todo-item')).toHaveLength(3);
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });
});
