import { useState } from "react";
import type { FormEvent } from "react";
import { Paperclip, Check } from "lucide-react";

interface TaskFormProps {
  onSubmit: (
    title: string,
    description: string,
    image: File | null,
  ) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await onSubmit(title, description, image);

    setTitle("");
    setDescription("");
    setImage(null);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          />
        </div>

        <div>
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors duration-200"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="file-input"
            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 text-center"
          >
            <span className="text-gray-600 dark:text-gray-300 flex items-center justify-center">
              <Paperclip className="mr-2 h-5 w-5" />
              {image ? image.name : "Attach Image (Optional)"}
            </span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 text-gray-900 bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-400 dark:text-white font-bold rounded-lg transition-all duration-200  hover:scale-101 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {loading ? (
            "Creating..."
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" /> Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
}
