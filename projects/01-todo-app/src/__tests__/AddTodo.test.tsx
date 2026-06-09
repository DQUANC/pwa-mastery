/**
 * Tests for the AddTodo component.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AddTodo } from '../components/AddTodo';

describe('AddTodo', () => {
  it('renders an input and a submit button', () => {
    render(<AddTodo onAdd={jest.fn()} />);

    expect(screen.getByRole('textbox', { name: /new todo title/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<AddTodo onAdd={jest.fn()} />);

    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('submit button is enabled when input has text', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={jest.fn()} />);

    await user.type(screen.getByRole('textbox', { name: /new todo title/i }), 'New task');
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
  });

  it('calls onAdd with the trimmed title on submit', async () => {
    const onAdd = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo title/i });
    await user.type(input, '  Buy groceries  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith({ title: 'Buy groceries' });
  });

  it('clears the input after successful submission', async () => {
    const onAdd = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo title/i });
    await user.type(input, 'New task');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(input).toHaveValue(''));
  });

  it('does not call onAdd for whitespace-only input', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo title/i });
    await user.type(input, '   ');

    // Button should still be disabled since trimmed = empty
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    expect(onAdd).not.toHaveBeenCalled();
  });
});
