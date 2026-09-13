import { create } from "zustand";
import { Task } from "../types/task";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "isDone" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  addTask: (payload) => {
    const newTask: Task = {
      ...payload,
      id: Date.now().toString(),
      isDone: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  updateTask: (id, payload) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...payload } : t)),
    }));
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
  toggleDone: (id) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, isDone: !t.isDone } : t
      ),
    }));
  },
  getTaskById: (id) => {
    return get().tasks.find((t) => t.id === id);
  },
}));
