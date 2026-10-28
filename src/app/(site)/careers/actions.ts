"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  job_id: z.string().uuid("Please pick a valid opening"),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]).optional(),
  qualification: z.string().trim().max(200).optional(),
  experience: z.string().trim().max(100).optional(),
  resume_link: z.union([z.literal(""), z.string().trim().max(300).regex(/^https:\/\//, "Link must start with https://")]).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot - bots fill it, people never see it
});

export type ApplyState = { ok: boolean; message: string; errors?: Record<string, string> };

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }
  const d = parsed.data;

  // Anonymous key only: the database lets visitors INSERT an application and read open jobs, nothing else.
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

  // the opening must still be switched on and inside its dates
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const { data: job } = await db.from("jobs").select("id,title,opening_date,closing_date,is_active").eq("id", d.job_id).maybeSingle();
  if (!job || !job.is_active || job.opening_date > today || job.closing_date < today) {
    return { ok: false, message: "Sorry, this opening is closed." };
  }

  const { error } = await db.from("job_applications").insert({
    job_id: job.id,
    job_title: job.title,
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    qualification: d.qualification || null,
    experience: d.experience || null,
    resume_link: d.resume_link || null,
    message: d.message || null,
  });
  if (error) {
    console.error("application insert failed", error.message);
    return { ok: false, message: "Sorry, we could not send your application. Please call us instead." };
  }
  return { ok: true, message: "Thank you! Your application has been received. We will contact you if you are shortlisted." };
}
