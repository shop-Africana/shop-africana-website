import { BrandLockup } from "@/components/brand/BrandLockup";
import { OwnerResetPasswordForm } from "@/components/owner/OwnerResetPasswordForm";
import { Container } from "@/components/ui/Container";

export default function OwnerResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,var(--color-pride-50),#fff)] py-12">
      <Container className="max-w-xl">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]">
          <BrandLockup brand="restaurant" size="lg" />
          <h1 className="mt-8 text-3xl font-extrabold text-[var(--color-pride-800)]">
            Set New Password
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Use the recovery link from Supabase Auth, then set a new owner password.
          </p>
          <OwnerResetPasswordForm />
        </div>
      </Container>
    </main>
  );
}
