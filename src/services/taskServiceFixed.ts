
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  points: number;
  requirements: any;
  rewards: any;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  status: string;
  completed_at: string | null;
  task: Task;
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Profile',
    description: 'Fill out all profile information',
    type: 'onboarding',
    points: 50,
    requirements: { profile_complete: true },
    rewards: { points: 50 }
  },
  {
    id: '2',
    title: 'Connect Wallet',
    description: 'Connect your crypto wallet',
    type: 'onboarding',
    points: 100,
    requirements: { wallet_connected: true },
    rewards: { points: 100 }
  },
  {
    id: '3',
    title: 'First Mining Session',
    description: 'Complete your first mining session',
    type: 'mining',
    points: 200,
    requirements: { mining_sessions: 1 },
    rewards: { points: 200 }
  }
];

// Mocked user tasks for now - will be replaced with DB integration
export const fetchAllTasks = async (): Promise<Task[]> => {
  // In a real implementation, you would fetch from the database
  // const { data, error } = await supabase.from("tasks").select("*");
  
  // Return mock data for now
  return MOCK_TASKS;
};

export const fetchUserTasks = async (userId: string): Promise<UserTask[]> => {
  // In a real implementation, this would join user_tasks with tasks
  // const { data, error } = await supabase
  //   .from("user_tasks")
  //   .select("*, task:tasks(*)")
  //   .eq("user_id", userId);
  
  // Mock implementation for now
  const mockUserTasks: UserTask[] = MOCK_TASKS.map(task => ({
    id: `ut-${task.id}`,
    user_id: userId,
    task_id: task.id,
    status: Math.random() > 0.5 ? 'completed' : 'in_progress',
    completed_at: Math.random() > 0.5 ? new Date().toISOString() : null,
    task
  }));
  
  return mockUserTasks;
};

export const fetchTasksByType = async (type: string): Promise<Task[]> => {
  // In a real implementation:
  // const { data, error } = await supabase
  //   .from("tasks")
  //   .select("*")
  //   .eq("type", type);
  
  // Mock implementation:
  return MOCK_TASKS.filter(task => task.type === type);
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  // In a real implementation:
  // const { data, error } = await supabase
  //   .from("tasks")
  //   .select("*")
  //   .eq("id", taskId)
  //   .single();
  
  // Mock implementation:
  const task = MOCK_TASKS.find(t => t.id === taskId);
  return task || null;
};

export const updateUserTaskStatus = async (
  userId: string,
  taskId: string,
  status: string,
  completedAt?: string
): Promise<void> => {
  // In a real implementation, you would update the user_task entry
  // or create one if it doesn't exist
  
  // Mock implementation - no-op for now
  console.log(`Updating task ${taskId} for user ${userId} to status ${status}`);
};
