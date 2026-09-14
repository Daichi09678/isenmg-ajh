export type Priority = "Low" | "Medium" | "High" | "Rendah" | "Sedang" | "Tinggi";
export type FilterType = "All" | "Active" | "Completed";

export type Urgency = "Rendah" | "Sedang" | "Tinggi" | "Kritis";
export type TaskType = "Personal" | "Team";
export type TaskStatus = "Backlog" | "Doing" | "MR" | "Testing" | "Done";

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  deadline: string;
  estimatedTime?: string;
  priority: Priority;
  urgency?: Urgency;
  reminder?: boolean;
  isDone: boolean;
  createdAt: string;
  taskType?: TaskType;
  status?: TaskStatus;
  members?: string[];
  joinRequests?: string[];
  comments?: Comment[];
}
