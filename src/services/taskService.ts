
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'social';
  points: number;
  created_at: string;
  updated_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
  task?: Task;
}

export const taskService = {
  // Get all available tasks
  async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('type', { ascending: true })
        .order('points', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },
  
  // Get tasks completed by a user
  async getUserCompletedTasks(userId: string): Promise<UserTask[]> {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*, task:task_id(*)')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return [];
    }
  },
  
  // Get tasks by type (daily, weekly, social)
  async getTasksByType(type: 'daily' | 'weekly' | 'social'): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', type)
        .order('points', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${type} tasks:`, error);
      return [];
    }
  },
  
  // Complete a task
  async completeTask(userId: string, taskId: string): Promise<boolean> {
    try {
      // First check if task is already completed
      const { data: existingTask, error: checkError } = await supabase
        .from('user_tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingTask) {
        toast.error("You've already completed this task");
        return false;
      }
      
      // Get task point value
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('points')
        .eq('id', taskId)
        .single();
        
      if (taskError) throw taskError;
      
      // Complete the task
      const { error } = await supabase
        .from('user_tasks')
        .insert({
          user_id: userId,
          task_id: taskId
        });
        
      if (error) throw error;
      
      // Update user points
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ 
          points: supabase.rpc('increment', { 
            x: taskData.points 
          })
        })
        .eq('id', userId);
        
      if (pointsError) throw pointsError;
      
      toast.success(`Task completed! +${taskData.points} points`);
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
      return false;
    }
  },
  
  // Get user total points
  async getUserPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data?.points || 0;
    } catch (error) {
      console.error('Error fetching user points:', error);
      return 0;
    }
  },
  
  // Claim all completed tasks points (for visual effect, points are already added)
  async claimRewards(userId: string): Promise<boolean> {
    try {
      // Just for visual feedback - points are already added when tasks are completed
      toast.success("All rewards claimed successfully!");
      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast.error('Failed to claim rewards');
      return false;
    }
  }
};

// Need to create a DB function for incrementing values
export const createIncrementFunction = async () => {
  const { error } = await supabase.rpc('create_increment_function', {});
  if (error) console.error('Error creating increment function:', error);
};
