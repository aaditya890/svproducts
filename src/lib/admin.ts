import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Server-side admin guard. Every admin page and every admin action calls this first.
 *  Checks (1) a valid Supabase session (JWT verified locally - no network call when the project uses
 *  asymmetric keys) and (2) that the email is in public.admins (via is_admin()).
 *  Wrapped in cache() so the layout and the page share ONE check per request. */
export const requireAdmin = cache(async () => {
  await connection(); // request-time only (never prerendered)
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/admin/login");
  const { data: ok } = await supabase.rpc("is_admin");
  if (!ok) redirect("/admin/login?error=notadmin");
  return { supabase, user: { id: claims.sub as string, email: (claims.email as string | undefined) ?? "" } };
});

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
