import { useState } from "react";
import type { Task } from "./TaskManager";
import { Save, X, Pencil, Trash } from "lucide-react"; // Import Lucide icons

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await onUpdate(task.id, editDescription);
    setIsEditing(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(task.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
          {task.title}
        </h3>
        <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm rounded-full">
          {formatDate(task.created_at)}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-4">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-900 dark:text-white resize-none transition-colors duration-200"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg text-neutral-900 dark:text-white font-bold bg-neutral-300 dark:bg-neutral-900 transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:disabled:bg-neutral-900 flex items-center"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditDescription(task.description);
              }}
              className="px-4 py-2.5 rounded-lg text-neutral-900 dark:text-white font-bold bg-neutral-300 dark:bg-neutral-900 transition-all duration-200 hover:scale-105 flex items-center"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={task.image_url}
            alt={task.title}
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      {!isEditing && (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-lg text-neutral-900 dark:text-white font-bold bg-neutral-200 dark:bg-neutral-900 transition-all duration-200 hover:scale-105 flex items-center"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg text-neutral-900 dark:text-white font-bold bg-neutral-200 dark:bg-neutral-900 transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:transform-none flex items-center"
          >
            {loading ? (
              "Deleting..."
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
