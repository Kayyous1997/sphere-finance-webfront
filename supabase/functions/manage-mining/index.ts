import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the request body
    const { action, userId, sessionId, workerData, isOffline = false } = await req.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Handle different mining actions
    switch (action) {
      case "startMining": {
        // Check if there's already an active session
        const { data: existingSession } = await supabase
          .from("mining_sessions")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "active")
          .maybeSingle();

        if (existingSession) {
          // If there's already an active session, return it
          const { data: session } = await supabase
            .from("mining_sessions")
            .select("*")
            .eq("id", existingSession.id)
            .single();

          return new Response(
            JSON.stringify({ session }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }

        // Calculate initial mining stats
        const initialHashrate = workerData?.hashrate || Math.floor(Math.random() * 30) + 10;
        const isOfflineMining = isOffline === true;

        // Create a new mining session
        const { data: session, error } = await supabase
          .from("mining_sessions")
          .insert({
            user_id: userId,
            status: "active",
            total_hashrate: initialHashrate,
            shares_accepted: 0,
            shares_rejected: 0,
            rewards_earned: 0,
            worker_details: {
              ...workerData,
              is_offline: isOfflineMining
            }
          })
          .select()
          .single();

        if (error) throw error;

        // If it's offline mining, update the user's profile stats
        if (isOfflineMining) {
          // Get referral bonus multiplier if applicable
          const { data: profile } = await supabase
            .from("profiles")
            .select("referred_by")
            .eq("id", userId)
            .single();

          const hasReferral = !!profile?.referred_by;
          const bonusMultiplier = hasReferral ? 1.1 : 1; // 10% bonus for referred users

          // Schedule regular updates for offline mining
          const offlineHashrate = initialHashrate * bonusMultiplier;
          const estimatedShares = Math.floor(offlineHashrate * 0.1); // Simplified calculation
          const estimatedRewards = estimatedShares * 0.01; // Simplified calculation

          // Update profile with offline mining stats
          await supabase
            .from("profiles")
            .update({
              hashrate: offlineHashrate,
              total_shares: supabase.rpc("increment", { row_id: userId, table: "profiles", column: "total_shares", value: estimatedShares }),
              mining_rewards: supabase.rpc("increment", { row_id: userId, table: "profiles", column: "mining_rewards", value: estimatedRewards })
            })
            .eq("id", userId);
        }

        return new Response(
          JSON.stringify({ session }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      case "stopMining": {
        if (!sessionId) {
          throw new Error("Session ID is required");
        }

        // End the mining session
        const { data: session, error } = await supabase
          .from("mining_sessions")
          .update({
            status: "completed",
            ended_at: new Date().toISOString(),
          })
          .eq("id", sessionId)
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;

        // Check if this was an offline mining session
        const isOfflineMining = session.worker_details?.is_offline === true;

        // If offline mining, update the user's accumulated stats
        if (isOfflineMining) {
          // Reset offline mining stats but keep the accumulated rewards
          await supabase
            .from("profiles")
            .update({
              hashrate: 0
            })
            .eq("id", userId);
        }

        return new Response(
          JSON.stringify({ session }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      case "updateStats": {
        if (!sessionId) {
          throw new Error("Session ID is required");
        }
        
        // Get current session
        const { data: currentSession, error: sessionError } = await supabase
          .from("mining_sessions")
          .select("*")
          .eq("id", sessionId)
          .single();
        
        if (sessionError) throw sessionError;
        
        // Calculate new stats
        const hashrateDelta = workerData.hashrate || 0;
        const sharesAcceptedDelta = workerData.shares_accepted || 0;
        const sharesRejectedDelta = workerData.shares_rejected || 0;
        const rewardsDelta = workerData.rewards || 0;
        
        // Update the session with new stats
        const { data: session, error: updateError } = await supabase
          .from("mining_sessions")
          .update({
            total_hashrate: hashrateDelta,
            shares_accepted: currentSession.shares_accepted + sharesAcceptedDelta,
            shares_rejected: currentSession.shares_rejected + sharesRejectedDelta,
            rewards_earned: currentSession.rewards_earned + rewardsDelta,
            worker_details: {
              ...currentSession.worker_details,
              last_update: new Date().toISOString(),
              ...workerData
            },
          })
          .eq("id", sessionId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        
        // Update worker stats if worker_id is provided
        if (workerData.worker_id) {
          await supabase
            .from("mining_workers")
            .update({
              hashrate: hashrateDelta,
              last_active: new Date().toISOString(),
              session_id: sessionId,
            })
            .eq("id", workerData.worker_id)
            .eq("user_id", userId);
        }
        
        return new Response(
          JSON.stringify({ session }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error("Error in manage-mining function:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
