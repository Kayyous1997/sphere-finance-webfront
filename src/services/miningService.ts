import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

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

export interface ReferralInfo {
  code: string;
  count: number;
}

export const miningService = {
  // Session management
  async startMining(userId: string, workerData: any): Promise<MiningSession> {
    try {
      const { data, error } = await supabase.functions.invoke('manage-mining', {
        body: { action: 'startMining', userId, workerData }
      });
      
      if (error) throw error;
      // Cast the status to the expected type
      return {
        ...data.session,
        status: data.session.status as 'active' | 'completed' | 'terminated'
      };
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
      // Cast the status to the expected type
      return {
        ...data.session,
        status: data.session.status as 'active' | 'completed' | 'terminated'
      };
    } catch (error) {
      console.error('Error stopping mining session:', error);
      toast.error('Failed to stop mining session');
      throw error;
    }
  },
  
  async updateMiningStats(userId: string, sessionId: string, stats: any): Promise<MiningSession | null> {
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
      // Cast the status to the expected type
      return {
        ...data.session,
        status: data.session.status as 'active' | 'completed' | 'terminated'
      };
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
      
      if (!data) return null;
      
      // Cast the status to the expected type
      return {
        ...data,
        status: data.status as 'active' | 'completed' | 'terminated',
        worker_details: data.worker_details as any
      };
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
      // Cast the status to the expected type
      return {
        ...data.worker,
        status: data.worker.status as 'online' | 'offline' | 'maintenance',
        hardware_details: data.worker.hardware_details as any
      };
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
      // Cast the status to the expected type
      return {
        ...data.worker,
        status: data.worker.status as 'online' | 'offline' | 'maintenance',
        hardware_details: data.worker.hardware_details as any
      };
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
      if (!data) return [];
      
      // Map and cast each worker's status to the expected type
      return data.map(worker => ({
        ...worker,
        status: worker.status as 'online' | 'offline' | 'maintenance',
        hardware_details: worker.hardware_details as any
      }));
    } catch (error) {
      console.error('Error fetching user workers:', error);
      return [];
    }
  },

  // Referral system
  async getUserReferrals(userId: string): Promise<ReferralInfo> {
    try {
      // Get user profile to check for referral code
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      let referralCode = profile?.referral_code || '';
      
      // If no referral code exists, generate one and save it
      if (!referralCode) {
        referralCode = `SPH${userId.substring(0, 8)}`;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ referral_code: referralCode })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error saving referral code:', updateError);
        }
      }
      
      // Count how many users have used this referral code
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by', userId);
        
      if (countError) throw countError;
      
      return {
        code: referralCode,
        count: count || 0
      };
    } catch (error) {
      console.error('Error getting user referrals:', error);
      return { code: '', count: 0 };
    }
  },
  
  async applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
    try {
      // Find the user who owns this referral code
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single();
        
      if (referrerError || !referrer) {
        toast.error('Invalid referral code');
        return false;
      }
      
      // Make sure user isn't referring themselves
      if (referrer.id === userId) {
        toast.error('You cannot refer yourself');
        return false;
      }
      
      // Check if user has already been referred
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referred_by')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      if (profile.referred_by) {
        toast.error('You have already used a referral code');
        return false;
      }
      
      // Apply the referral
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referred_by: referrer.id })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      toast.success('Referral code applied successfully');
      return true;
    } catch (error) {
      console.error('Error applying referral code:', error);
      toast.error('Error applying referral code');
      return false;
    }
  }
};
