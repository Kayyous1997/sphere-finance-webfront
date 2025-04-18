import { type Task, type UserTask } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    .from('user_profiles')
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
