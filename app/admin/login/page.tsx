"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

const EMAIL = "amanchhetri.aus@gmail.com";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(formData: FormData) {
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({ email: EMAIL, password: String(formData.get("password")) });
    if (error) {
      setError("That password didn't work. Check it and try again.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <form action={signIn} className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Career admin</h1>
        <p className="mt-2 text-muted-foreground">Private. Signed in as {EMAIL}.</p>
        <label htmlFor="password" className="mt-8 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {error && (
          <p role="alert" className="mt-3 text-sm text-negative">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
