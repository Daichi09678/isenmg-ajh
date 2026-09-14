export type Priority = "Low" | "Medium" | "High" | "Rendah" | "Sedang" | "Tinggi";
export type FilterType = "All" | "Active" | "Completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  deadline: string;
  priority: Priority;
  reminder?: boolean;
  isDone: boolean;
  createdAt: string;
}
