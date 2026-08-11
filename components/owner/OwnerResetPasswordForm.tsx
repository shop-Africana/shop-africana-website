"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { OwnerPasswordInput } from "@/components/owner/OwnerPasswordInput";
import { Button } from "@/components/ui/Button";

export function OwnerResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8 || password !== confirmPassword) {
      setError("Use matching passwords with at least 8 characters.");
      return;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      setError("Password reset is not configured.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createBrowserClient(url, anonKey);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("The reset session is not active. Request a new reset link.");
      setIsSubmitting(false);
      return;
    }

    router.push("/owner/login?reset=1");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      {error ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-destructive-border)] bg-[var(--color-destructive-soft)] p-4 text-sm font-bold text-[var(--color-destructive)]">
          {error}
        </div>
      ) : null}
      <OwnerPasswordInput
        name="password"
        placeholder="New password"
        required
      />
      <OwnerPasswordInput
        name="confirmPassword"
        placeholder="Confirm new password"
        required
      />
      <Button
        type="submit"
        variant="restaurant"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating Password" : "Update Password"}
      </Button>
    </form>
  );
}
