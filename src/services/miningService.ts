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
  is_offline?: boolean; // Flag to indicate offline mining
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
  async startMining(userId: string, workerData: any, isOffline = false): Promise<MiningSession> {
    try {
      // Check if user already has an active session to prevent duplicates
      const existingSession = await this.getActiveMiningSession(userId);
      if (existingSession) {
        return existingSession;
      }

      const sessionData = {
        action: 'startMining', 
        userId, 
        workerData,
        isOffline
      };

      const { data, error } = await supabase.functions.invoke('manage-mining', {
        body: sessionData
      });
      
      if (error) throw error;
      
      // Cast the status to the expected type
      return {
        ...data.session,
        status: data.session.status as 'active' | 'completed' | 'terminated',
        is_offline: isOffline
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
  
  async getOfflineMiningStats(userId: string): Promise<{
    totalHashrate: number;
    totalShares: number;
    totalRewards: number;
  }> {
    try {
      // Get the user's mining stats from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('hashrate, total_shares, mining_rewards')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return {
        totalHashrate: data?.hashrate || 0,
        totalShares: data?.total_shares || 0,
        totalRewards: data?.mining_rewards || 0
      };
    } catch (error) {
      console.error('Error getting offline mining stats:', error);
      return {
        totalHashrate: 0,
        totalShares: 0,
        totalRewards: 0
      };
    }
  },
  
  async startOfflineMining(userId: string): Promise<boolean> {
    try {
      // Generate simulated mining stats based on the user's profile
      const baseHashrate = Math.floor(Math.random() * 50) + 10; // 10-60 MH/s base rate
      
      // Start an offline mining session
      await this.startMining(userId, {
        hashrate: baseHashrate,
        worker_type: 'offline',
        hardware_details: {
          type: 'offline',
          name: 'Offline Miner'
        }
      }, true);
      
      return true;
    } catch (error) {
      console.error('Error starting offline mining:', error);
      return false;
    }
  },
  
  // Return total mining stats (combining online and offline) - Implement caching to prevent repeated calculation
  async getTotalMiningStats(userId: string): Promise<{
    combinedHashrate: number;
    combinedShares: number;
    combinedRewards: number;
    onlineActive: boolean;
    offlineActive: boolean;
  }> {
    try {
      // Get online mining stats from active session
      const activeSession = await this.getActiveMiningSession(userId);
      const onlineActive = !!activeSession && !activeSession.is_offline;
      
      // Get offline mining stats
      const offlineStats = await this.getOfflineMiningStats(userId);
      const offlineActive = !!activeSession?.is_offline;
      
      // Store the timestamp of when these stats were calculated to prevent recalculation on refresh
      const currentStats = {
        combinedHashrate: (activeSession?.total_hashrate || 0) + offlineStats.totalHashrate,
        combinedShares: (activeSession?.shares_accepted || 0) + offlineStats.totalShares,
        combinedRewards: (activeSession?.rewards_earned || 0) + offlineStats.totalRewards,
        onlineActive,
        offlineActive,
        lastUpdated: new Date().getTime()
      };
      
      // Store in localStorage to prevent artificial increases on page refresh
      localStorage.setItem(`mining_stats_${userId}`, JSON.stringify(currentStats));
      
      return {
        combinedHashrate: currentStats.combinedHashrate,
        combinedShares: currentStats.combinedShares,
        combinedRewards: currentStats.combinedRewards,
        onlineActive,
        offlineActive
      };
    } catch (error) {
      console.error('Error getting total mining stats:', error);
      return {
        combinedHashrate: 0,
        combinedShares: 0,
        combinedRewards: 0,
        onlineActive: false,
        offlineActive: false
      };
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

  // Referral system - Add real-time subscription capabilities
  async getUserReferrals: async (userId: string) => {
    if (!userId) return { count: 0, totalBonus: 0 };
    
    try {
      console.log(`Fetching referral data for user ${userId}`);
      
      // Count users who were referred by this user
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId);
      
      if (error) {
        console.error("Error fetching referrals:", error);
        return { count: 0, totalBonus: 0 };
      }
      
      const referralCount = referrals ? referrals.length : 0;
      console.log(`Found ${referralCount} referrals for user ${userId}`);
      
      // Calculate bonus based on referral count
      let baseBonus = referralCount * 5;
      let milestoneBonus = 0;
      
      if (referralCount >= 50) milestoneBonus = 100;
      else if (referralCount >= 25) milestoneBonus = 50;
      else if (referralCount >= 10) milestoneBonus = 25;
      else if (referralCount >= 5) milestoneBonus = 10;
      
      const totalBonus = baseBonus + milestoneBonus;
      
      return { 
        count: referralCount, 
        totalBonus: totalBonus,
        referrals: referrals 
      };
    } catch (err) {
      console.error("Error in getUserReferrals:", err);
      return { count: 0, totalBonus: 0 };
    }
  },
  
  async applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
    try {
      console.log(`Applying referral code: ${referralCode} for user: ${userId}`);
      
      // Find the user who owns this referral code
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single();
        
      if (referrerError || !referrer) {
        console.error("Invalid referral code:", referrerError);
        toast.error('Invalid referral code');
        return false;
      }
      
      // Make sure user isn't referring themselves
      if (referrer.id === userId) {
        console.error("User tried to refer themselves");
        toast.error('You cannot refer yourself');
        return false;
      }
      
      // Check if user has already been referred
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referred_by')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error checking profile:", profileError);
        throw profileError;
      }
      
      if (profile.referred_by) {
        console.error("User already has a referrer");
        toast.error('You have already used a referral code');
        return false;
      }
      
      console.log("About to insert referral record and update profile");
      
      // IMPORTANT: First create a record in the referrals table
      const { error: referralError, data: referralData } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.id,
          referred_id: userId,
          points_awarded: false
        })
        .select();
      
      if (referralError) {
        console.error("Error creating referral record:", referralError);
        throw referralError;
      }
      
      console.log("Referral record created successfully:", referralData);
      
      // Then update user profile with referrer ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referred_by: referrer.id })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error applying referral:", updateError);
        throw updateError;
      }
      
      console.log("Profile updated successfully with referrer ID");
      
      toast.success('Referral code applied successfully');
      console.log(`Referral successfully applied: ${userId} was referred by ${referrer.id}`);
      return true;
    } catch (error) {
      console.error('Error applying referral code:', error);
      toast.error('Error applying referral code');
      return false;
    }
  },
  
  // Enhanced method to subscribe to referral changes
  subscribeToReferralUpdates: (userId: string, callback: (data: any) => void) => {
    console.log(`Setting up referral subscription for user ${userId}`);
    
    // Enable Supabase realtime for the referrals table
    // This subscription will be triggered whenever a new referral is added
    const subscription = supabase
      .channel('referrals_changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'referrals',
          filter: `referrer_id=eq.${userId}`
        }, 
        async (payload) => {
          console.log('Referral change detected:', payload);
          
          // Get updated referral data
          const referralData = await miningService.getUserReferrals(userId);
          
          // Send updated data to the callback
          callback(referralData);
        }
      )
      .subscribe();
    
    return {
      unsubscribe: () => {
        console.log(`Cleaning up referral subscription for user ${userId}`);
        supabase.removeChannel(subscription);
      }
    };
  }
};
