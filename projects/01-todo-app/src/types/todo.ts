export type SyncStatus = 'synced' | 'pending' | 'failed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  syncStatus: SyncStatus;
  createdAt: number;
  updatedAt: number;
}

export type CreateTodoInput = Pick<Todo, 'title'>;
export type UpdateTodoInput = Partial<Pick<Todo, 'title' | 'completed'>>;
