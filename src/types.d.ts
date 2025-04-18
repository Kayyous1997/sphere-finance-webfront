
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (accounts: string[]) => void) => void;
    isMetaMask?: boolean;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  type: "daily" | "weekly" | "social";
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
}
