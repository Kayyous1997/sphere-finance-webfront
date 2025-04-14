
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
    const { action, userId, workerId, workerData } = await req.json();
    
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
      case "createWorker":
        // Create a new worker
        const { data: workerCreated, error: createError } = await supabase
          .from("mining_workers")
          .insert({
            user_id: userId,
            name: workerData.name,
            worker_type: workerData.type || "gpu",
            hashrate: workerData.hashrate || 0,
            temperature: workerData.temperature || 0,
            power_usage: workerData.power || 0,
            hardware_details: {
              cpu: workerData.cpu || "",
              gpu: workerData.gpu || "",
              memory: workerData.memory || "",
              storage: workerData.storage || ""
            }
          })
          .select()
          .single();
          
        if (createError) throw createError;
        result = { success: true, worker: workerCreated };
        break;
        
      case "updateWorker":
        // Update worker details
        const { data: workerUpdated, error: updateError } = await supabase
          .from("mining_workers")
          .update({
            name: workerData.name,
            worker_type: workerData.type,
            status: workerData.status,
            hashrate: workerData.hashrate,
            temperature: workerData.temperature,
            power_usage: workerData.power,
            last_active: new Date().toISOString(),
            hardware_details: workerData.hardware_details
          })
          .eq("id", workerId)
          .eq("user_id", userId)
          .select()
          .single();
          
        if (updateError) throw updateError;
        result = { success: true, worker: workerUpdated };
        break;
        
      case "deleteWorker":
        // Delete worker
        const { error: deleteError } = await supabase
          .from("mining_workers")
          .delete()
          .eq("id", workerId)
          .eq("user_id", userId);
          
        if (deleteError) throw deleteError;
        result = { success: true };
        break;
        
      case "getWorkers":
        // Get all workers for user
        const { data: workers, error: listError } = await supabase
          .from("mining_workers")
          .select("*")
          .eq("user_id", userId);
          
        if (listError) throw listError;
        result = { success: true, workers };
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in manage-workers function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
