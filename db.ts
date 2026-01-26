import { createClient } from "@supabase/supabase-js@^2.48.0";

const url = Deno.env.get("SUPABASE_URL") || "";
const key = Deno.env.get("SUPABASE_ANON_KEY") || "";

export const supabase = createClient(url, key);
