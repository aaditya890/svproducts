import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Boxes, ExternalLink, FolderTree, Inbox, LayoutDashboard, LogOut, Megaphone } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { logout } from "../actions";
import { site } from "@/config/site";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/quotes", label: "Quote requests", icon: Inbox },
  { href: "/admin/announcement", label: "Announcement", icon: Megaphone },
];

async function Shell({ children }: { children: React.ReactNode }) {
  const { user, supabase } = await requireAdmin(); // server-side guard for every panel page
  const { count: newLeads } = await supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new");
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col bg-navy-dark text-white md:min-h-screen md:w-60">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <Image src={site.logo} alt="" width={36} height={42} className="h-9 w-auto rounded" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{site.shortName}</p>
            <p className="text-[10px] tracking-widest text-forge">ADMIN</p>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-1 p-2 md:flex md:flex-col">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-forge">
              <Icon size={18} /> {label}
              {href === "/admin/quotes" && !!newLeads && <span className="ml-auto rounded-full bg-furnace px-2 py-0.5 text-[11px] font-bold text-white">{newLeads}</span>}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/60 hover:text-forge">
            <ExternalLink size={18} /> View website
          </Link>
        </nav>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 p-4 text-xs md:block">
          <p className="truncate text-white/60">{user.email}</p>
          <form action={logout}>
            <button className="mt-2 flex items-center gap-2 text-forge hover:underline"><LogOut size={14} /> Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}

// Admin pages are private and always fetch live data - they are not meant to be prerendered/instant.
export const instant = false;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="p-10 text-steel">Loading admin...</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
