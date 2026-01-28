import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";
import type { Session } from "@supabase/supabase-js";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

export function TaskManager({ session }: { session: Session }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error reading task: ", error);
      return;
    }
    setTasks(data);
  };

  const updateTask = async (id: number, description: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ description })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    fetchTasks();
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;
    const { error } = await supabase.storage
      .from("tasks-images")
      .upload(filePath, file);
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = await supabase.storage
      .from("tasks-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const createTask = async (
    title: string,
    description: string,
    image: File | null,
  ) => {
    let imageUrl: string | null = null;

    if (image) {
      imageUrl = await uploadImage(image);
    }

    const { error } = await supabase
      .from("tasks")
      .insert({
        title,
        description,
        email: session.user.email,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!session?.access_token) return;

    const channel = supabase.channel("tasks-channel");
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          const newTask = payload.new as Task;
          setTasks((prev) => [...prev, newTask]);
        },
      )
      .subscribe((status) => {
        console.log("Status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [session]);

  return (
    <div className="space-y-8">
      <TaskForm onSubmit={createTask} />
      <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
    </div>
  );
}
