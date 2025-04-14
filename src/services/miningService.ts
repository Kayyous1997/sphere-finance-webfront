
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for mining operations
export interface MiningSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  total_hashrate: number;
  shares_accepted: number;
  shares_rejected: number;
  rewards_earned: number;
  status: 'active' | 'completed' | 'terminated';
  worker_details: any;
}

export interface MiningWorker {
  id: string;
  user_id: string;
  session_id: string | null;
  name: string;
  worker_type: string;
  status: 'online' | 'offline' | 'maintenance';
  hashrate: number;
  temperature: number;
  power_usage: number;
  created_at: string;
  last_active: string;
  hardware_details: {
    cpu: string;
    gpu: string;
    memory: string;
    storage: string;
  };
}

export const miningService = {
  // Session management
  async startMining(userId: string, workerData: any): Promise<MiningSession> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-mining', {
        body: { action: 'startMining', userId, workerData }
      });
      
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error starting mining session:', error);
      toast.error('Failed to start mining session');
      throw error;
    }
  },
  
  async stopMining(userId: string, sessionId: string): Promise<MiningSession> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-mining', {
        body: { action: 'stopMining', userId, sessionId }
      });
      
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error stopping mining session:', error);
      toast.error('Failed to stop mining session');
      throw error;
    }
  },
  
  async updateMiningStats(userId: string, sessionId: string, stats: any): Promise<MiningSession> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-mining', {
        body: { 
          action: 'updateStats', 
          userId, 
          sessionId, 
          workerData: stats 
        }
      });
      
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error updating mining stats:', error);
      return null;
    }
  },
  
  async getActiveMiningSession(userId: string): Promise<MiningSession | null> {
    try {
      const { data, error } = await supabase
        .from('mining_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching active mining session:', error);
        return null;
      }
      
      return data || null;
    } catch (error) {
      console.error('Error getting active mining session:', error);
      return null;
    }
  },
  
  // Worker management
  async createWorker(userId: string, workerData: Partial<MiningWorker>): Promise<MiningWorker> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-workers', {
        body: { action: 'createWorker', userId, workerData }
      });
      
      if (error) throw error;
      toast.success('Worker created successfully');
      return data.worker;
    } catch (error) {
      console.error('Error creating worker:', error);
      toast.error('Failed to create worker');
      throw error;
    }
  },
  
  async updateWorker(userId: string, workerId: string, workerData: Partial<MiningWorker>): Promise<MiningWorker> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-workers', {
        body: { action: 'updateWorker', userId, workerId, workerData }
      });
      
      if (error) throw error;
      return data.worker;
    } catch (error) {
      console.error('Error updating worker:', error);
      toast.error('Failed to update worker');
      throw error;
    }
  },
  
  async deleteWorker(userId: string, workerId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('manage-workers', {
        body: { action: 'deleteWorker', userId, workerId }
      });
      
      if (error) throw error;
      toast.success('Worker deleted successfully');
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error('Failed to delete worker');
      throw error;
    }
  },
  
  async getUserWorkers(userId: string): Promise<MiningWorker[]> {
    try {
      const { data, error } = await supabase
        .from('mining_workers')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user workers:', error);
      return [];
    }
  }
};
