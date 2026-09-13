export type Priority = "Low" | "Medium" | "High";
export type FilterType = "All" | "Active" | "Completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: Priority;
  reminder: boolean;
  isDone: boolean;
  createdAt: string;
}
