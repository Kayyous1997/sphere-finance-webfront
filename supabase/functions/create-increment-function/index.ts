
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0';

serve(async (req) => {
  // Create a Supabase client with the service role key
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  try {
    // Create the increment function if it doesn't exist
    const { error } = await supabaseClient.rpc('create_increment_function', {});
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
