import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false, follow: false } };

// Admin pages are private and always fetch live data - they are not meant to be prerendered/instant.
export const instant = false;

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-mist">{children}</div>;
}
