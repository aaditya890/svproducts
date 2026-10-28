"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login, type LoginState } from "../actions";
import { btnCls, inputCls, Label } from "@/components/admin/ui";

export function LoginForm({ notAdmin }: { notAdmin: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: notAdmin ? "This account is not an admin." : "" });
  return (
    <form action={action} className="mt-6 space-y-4">
      <Label text="Email">
        <input name="email" type="email" required autoComplete="username" className={inputCls} />
      </Label>
      <Label text="Password">
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </Label>
      {state.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={`${btnCls} w-full`}>
        {pending && <Loader2 className="animate-spin" size={16} />} Sign in
      </button>
    </form>
  );
}
