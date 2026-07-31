import Link from "next/link";
import { requestOwnerPasswordReset } from "@/app/owner/actions";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";

export default async function OwnerForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,var(--color-pride-50),#fff)] py-12">
      <Container className="max-w-xl">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]">
          <BrandLockup brand="restaurant" size="lg" />
          <h1 className="mt-8 text-3xl font-extrabold text-[var(--color-pride-800)]">
            Reset Owner Password
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Enter the owner email address. If it can receive recovery mail, a reset
            link will be sent.
          </p>
          {params.sent ? (
            <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-success-border)] bg-[var(--color-success-soft)] p-4 text-sm font-bold text-[var(--color-success)]">
              Check the owner inbox for the password reset link.
            </div>
          ) : null}
          <form action={requestOwnerPasswordReset} className="mt-8 grid gap-4">
            <Input name="email" type="email" placeholder="Owner email" required />
            <Button type="submit" variant="restaurant" className="w-full">
              Send Reset Link
            </Button>
          </form>
          <Link
            href="/owner/login"
            className="mt-5 inline-block text-sm font-bold text-[var(--color-pride-800)] underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </Container>
    </main>
  );
}
