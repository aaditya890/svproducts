"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]).optional(),
  company: z.string().trim().max(160).optional(),
  city: z.string().trim().max(100).optional(),
  product: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Please tell us what you need").max(2000),
  website: z.string().max(0).optional(), // honeypot - bots fill it, humans never see it
});

export type QuoteState = { ok: boolean; message: string; errors?: Record<string, string> };

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }
  const d = parsed.data;

  // Anonymous (publishable) key only: RLS allows INSERT on quote_requests and nothing else.
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { error } = await db.from("quote_requests").insert({
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    company: d.company || null,
    city: d.city || null,
    message: d.message,
    items: d.product ? [{ product: d.product }] : [],
  });
  if (error) {
    console.error("quote insert failed", error.message);
    return { ok: false, message: "Sorry, we could not send your request. Please call us instead." };
  }
  return { ok: true, message: "Thank you! We have received your request and will contact you shortly." };
}
