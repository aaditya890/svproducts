import Image from "next/image";
import { Suspense } from "react";
import { site } from "@/config/site";
import { LoginForm } from "./LoginForm";

async function Form({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const sp = await searchParams;
  return <LoginForm notAdmin={sp.error === "notadmin"} />;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-steel px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <Image src={site.logo} alt={site.shortName} width={64} height={74} className="mx-auto h-16 w-auto rounded-lg" priority />
        <h1 className="mt-4 text-center text-xl font-bold text-navy">Admin login</h1>
        <p className="text-center text-xs text-steel">{site.name}</p>
        <Suspense fallback={<div className="mt-6 h-48 animate-pulse rounded-lg bg-mist" />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
