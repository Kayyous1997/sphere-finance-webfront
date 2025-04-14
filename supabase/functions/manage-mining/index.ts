
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const supabaseUrl = "https://ewqmrgcephdlggwsgxpu.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, userId, sessionId, workerData } = await req.json();
    
    // Get JWT token from request and verify it
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: "User ID mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    
    switch (action) {
      case "startMining":
        // Create a new mining session
        const { data: sessionData, error: sessionError } = await supabase
          .from("mining_sessions")
          .insert({
            user_id: userId,
            status: "active",
            worker_details: workerData || {}
          })
          .select()
          .single();
          
        if (sessionError) throw sessionError;
        
        // Update workers to associate with this session
        if (workerData && workerData.workers) {
          for (const worker of workerData.workers) {
            await supabase
              .from("mining_workers")
              .update({ 
                session_id: sessionData.id,
                status: "online",
                last_active: new Date().toISOString()
              })
              .eq("id", worker.id);
          }
        }
        
        result = { success: true, session: sessionData };
        break;
        
      case "stopMining":
        // Update the mining session to completed
        const { data: endedSession, error: endError } = await supabase
          .from("mining_sessions")
          .update({
            status: "completed",
            ended_at: new Date().toISOString()
          })
          .eq("id", sessionId)
          .eq("user_id", userId)
          .select()
          .single();
          
        if (endError) throw endError;
        
        // Update associated workers
        await supabase
          .from("mining_workers")
          .update({ 
            session_id: null,
            status: "offline"
          })
          .eq("session_id", sessionId);
        
        result = { success: true, session: endedSession };
        break;
        
      case "updateStats":
        // Update mining statistics for the session
        const { hashrate, shares_accepted, shares_rejected, rewards } = workerData;
        
        const { data: updatedSession, error: updateError } = await supabase
          .from("mining_sessions")
          .update({
            total_hashrate: hashrate,
            shares_accepted: shares_accepted,
            shares_rejected: shares_rejected,
            rewards_earned: rewards
          })
          .eq("id", sessionId)
          .eq("user_id", userId)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        // Update user profile with cumulative stats
        await supabase
          .from("profiles")
          .update({
            hashrate: hashrate,
            total_shares: shares_accepted,
            mining_rewards: rewards,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
        
        result = { success: true, session: updatedSession };
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in manage-mining function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
