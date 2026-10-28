import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS. Use ONLY in server code (route handlers / server actions).
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
