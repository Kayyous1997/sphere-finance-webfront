
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define Task and UserTask types and export them
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

// Export all the service functions
export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*");

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return data.map(task => ({
    ...task,
    type: task.type as "daily" | "weekly" | "social"
  }));
};

export const fetchUserTasks = async (userId: string): Promise<UserTask[]> => {
  const { data, error } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user tasks:", error);
    return [];
  }

  return data || [];
};

export const completeTask = async (userId: string, taskId: string): Promise<void> => {
  const { data, error } = await supabase
    .from("user_tasks")
    .insert([{ user_id: userId, task_id: taskId }]);

  if (error) {
    console.error("Error completing task:", error);
    toast.error("Failed to complete task.");
  } else {
    toast.success("Task completed!");
  }
};

export const uncompleteTask = async (userId: string, taskId: string): Promise<void> => {
  const { error } = await supabase
    .from("user_tasks")
    .delete()
    .eq("user_id", userId)
    .eq("task_id", taskId);

  if (error) {
    console.error("Error uncompleting task:", error);
    toast.error("Failed to uncomplete task.");
  } else {
    toast.success("Task uncompleted!");
  }
};
  
export const applyReferralCode = async (userId: string, referralCode: string): Promise<void> => {
  const { data, error } = await supabase
    .from('profiles')  // Changed from 'user_profiles' to 'profiles'
    .update({ referred_by: referralCode })
    .eq('id', userId)
    .select();

  if (error) {
    console.error("Error applying referral code:", error);
    toast.error("Failed to apply referral code.");
  } else {
    toast.success("Referral code applied successfully!");
  }
};

// Additional service functions for ContentPage.tsx
export const getTasksByType = async (type: "daily" | "weekly" | "social"): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("type", type);

  if (error) {
    console.error(`Error fetching ${type} tasks:`, error);
    return [];
  }

  return data as Task[];
};

export const getUserCompletedTasks = async (userId: string): Promise<UserTask[]> => {
  const { data, error } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching completed tasks:", error);
    return [];
  }

  return data as UserTask[];
};

export const getUserPoints = async (userId: string): Promise<number> => {
  // Fetch user completed tasks
  const userTasks = await getUserCompletedTasks(userId);
  
  // Fetch all tasks to get points information
  const allTasks = await fetchTasks();
  
  // Calculate total points
  let totalPoints = 0;
  
  for (const userTask of userTasks) {
    const task = allTasks.find(t => t.id === userTask.task_id);
    if (task) {
      totalPoints += task.points;
    }
  }
  
  return totalPoints;
};

export const claimRewards = async (userId: string): Promise<boolean> => {
  // This would typically interact with a rewards system
  // For now, we'll just show a success message
  toast.success("Rewards claimed successfully!");
  return true;
};

// Export a task service object that contains all the functions
export const taskService = {
  fetchTasks,
  fetchUserTasks,
  completeTask,
  uncompleteTask,
  applyReferralCode,
  getTasksByType,
  getUserCompletedTasks,
  getUserPoints,
  claimRewards
};
