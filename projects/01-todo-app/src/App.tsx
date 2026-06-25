import { useTodos } from './hooks/useTodos';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { ConnectionStatus } from './components/ConnectionStatus';

function App() {
  const { todos, loading, error, addTodoItem, toggleTodo, updateTodoTitle, deleteTodoItem } =
    useTodos();

  const pendingCount = todos.filter((t) => t.syncStatus === 'pending').length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          <p className="mt-1 text-sm text-gray-500">Offline-first with Background Sync</p>
        </header>

        {/* Connection status banner */}
        <div className="mb-4">
          <ConnectionStatus />
        </div>

        {/* Add todo form */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <AddTodo onAdd={addTodoItem} />
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mb-4 flex justify-between text-xs text-gray-400">
            <span>
              {completedCount} / {todos.length} completed
            </span>
            {pendingCount > 0 && (
              <span className="text-yellow-500">{pendingCount} pending sync</span>
            )}
          </div>
        )}

        {/* Todo list */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-400" role="status">
              Loading todos...
            </p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : (
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodoItem}
              onUpdate={(id, title) => updateTodoTitle(id, { title })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
