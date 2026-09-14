import { create } from "zustand";
import { Task, TaskStatus } from "../types/task";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "isDone" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  acceptJoinRequest: (taskId: string, email: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addComment: (taskId: string, author: string, text: string) => void;
}

const DUMMY_TASKS: Task[] = [
  // Personal Tasks
  { id: "1", title: "Olahraga Pagi", description: "Lari 5km", category: "Kesehatan" as any, priority: "Tinggi" as any, deadline: new Date().toISOString(), isDone: false, createdAt: new Date().toISOString(), taskType: "Personal" },
  { id: "2", title: "Baca Buku", description: "Minimal 1 bab", category: "Belajar" as any, priority: "Sedang" as any, deadline: new Date().toISOString(), isDone: true, createdAt: new Date().toISOString(), taskType: "Personal" },
  // Team Tasks
  { id: "3", title: "Menambah reverse tunnel dari server dev ke vps mitreka", description: "", priority: "Tinggi" as any, deadline: new Date().toISOString(), isDone: false, createdAt: new Date().toISOString(), taskType: "Team", status: "Backlog", members: ["Farid Abdul Aziz"], comments: [] },
  { id: "4", title: "[CMS-API] Pengecekan RBAC endpoints", description: "", priority: "Sedang" as any, deadline: new Date().toISOString(), isDone: false, createdAt: new Date().toISOString(), taskType: "Team", status: "Backlog", members: ["Puspita Sari"], comments: [] },
  { id: "5", title: "Testing SPTB", description: "melakukan cek aplikasi SPTB dengan testcase", priority: "Sedang" as any, deadline: new Date().toISOString(), isDone: false, createdAt: new Date().toISOString(), taskType: "Team", status: "Doing", members: ["Vrika Nurrahman"], comments: [{ id: "c1", author: "Vrika Nurrahman", text: "Mulai testing modul login", createdAt: new Date().toISOString() }] },
  { id: "6", title: "[API-CORE SERVICE] Survey", description: "", priority: "Tinggi" as any, deadline: new Date().toISOString(), isDone: false, createdAt: new Date().toISOString(), taskType: "Team", status: "Doing", members: ["Muhammad Ifrozin"], comments: [] },
  { id: "7", title: "bug fix foto profile tidak berdasarkan swafoto", description: "", priority: "Tinggi" as any, deadline: new Date().toISOString(), isDone: false, createdAt: new Date().toISOString(), taskType: "Team", status: "Testing", members: ["Muhammad Ifrozin"], comments: [] },
  { id: "8", title: "diskusi terkait bisnis proses OTP saat registrasi asmbo", description: "", priority: "Sedang" as any, deadline: new Date().toISOString(), isDone: true, createdAt: new Date().toISOString(), taskType: "Team", status: "Done", members: ["Muhammad Ifrozin"], comments: [] },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: DUMMY_TASKS,
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
  acceptJoinRequest: (taskId, email) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            members: [...(t.members || []), email],
            joinRequests: (t.joinRequests || []).filter((req) => req !== email),
          };
        }
        return t;
      }),
    }));
  },
  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t.id === taskId ? { ...t, status, isDone: status === "Done" } : t
      )
    }));
  },
  addComment: (taskId, author, text) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          const newComment = { id: Date.now().toString(), author, text, createdAt: new Date().toISOString() };
          return { ...t, comments: [...(t.comments || []), newComment] };
        }
        return t;
      })
    }));
  }
}));
