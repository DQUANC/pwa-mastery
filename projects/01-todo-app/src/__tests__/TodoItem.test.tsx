/**
 * Tests for the TodoItem component.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/todo';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 'test-id-1',
    title: 'Test Todo',
    completed: false,
    syncStatus: 'synced',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(
      <TodoItem
        todo={makeTodo()}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('renders a checkbox that reflects completed state', () => {
    render(
      <TodoItem
        todo={makeTodo({ completed: true })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('checkbox', { name: /mark "test todo" as incomplete/i }),
    ).toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={makeTodo()}
        onToggle={onToggle}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('test-id-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={makeTodo()}
        onToggle={jest.fn()}
        onDelete={onDelete}
        onUpdate={jest.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /delete "test todo"/i }));
    expect(onDelete).toHaveBeenCalledWith('test-id-1');
  });

  it('shows a pending sync indicator for pending todos', () => {
    render(
      <TodoItem
        todo={makeTodo({ syncStatus: 'pending' })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Pending sync')).toBeInTheDocument();
  });

  it('shows a failed sync indicator for failed todos', () => {
    render(
      <TodoItem
        todo={makeTodo({ syncStatus: 'failed' })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Sync failed')).toBeInTheDocument();
  });

  it('does not show sync indicator for synced todos', () => {
    render(
      <TodoItem
        todo={makeTodo({ syncStatus: 'synced' })}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    expect(screen.queryByLabelText('Pending sync')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Sync failed')).not.toBeInTheDocument();
  });
});
