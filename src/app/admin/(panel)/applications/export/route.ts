import { requireAdmin } from "@/lib/admin";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // quote everything and neutralise spreadsheet formulas (=, +, -, @)
  return `"${(/^[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`;
};

/** Admin only: download all job applications as a CSV file (opens in Excel / Google Sheets). */
export async function GET() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false }).limit(5000);
  const head = ["Date (IST)", "Status", "Job", "Name", "Phone", "Email", "Qualification", "Experience", "Resume link", "Message", "Notes"];
  const rows = (data ?? []).map((r) =>
    [new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), r.status, r.job_title, r.name, r.phone, r.email, r.qualification, r.experience, r.resume_link, r.message, r.notes].map(cell).join(","),
  );
  return new Response("﻿" + [head.map(cell).join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="job-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
