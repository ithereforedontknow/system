import type { Task } from "./TaskManager";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
        Your Tasks ({tasks.length})
      </h2>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No tasks yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
