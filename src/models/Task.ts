export type TaskStatus = "Todo" | "InProgress" | "Done";

export interface Task {
  id: string;
  status: TaskStatus;
  formData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
