import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";

export default async function OwnerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,var(--color-pride-50),#fff)] py-12">
      <Container className="max-w-xl">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]">
          <BrandLockup brand="restaurant" size="lg" />
          <h1 className="mt-8 text-3xl font-extrabold text-[var(--color-pride-800)]">
            Owner Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Sign in with the Supabase Auth owner account approved for menu
            management.
          </p>
          {params.error ? (
            <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-destructive-border)] bg-[var(--color-destructive-soft)] p-4 text-sm font-bold text-[var(--color-destructive)]">
              Sign-in failed. Check your email and password.
            </div>
          ) : null}
          <form
            action="/api/owner-login"
            method="post"
            className="mt-8 grid gap-4"
          >
            <Input name="email" type="email" placeholder="Owner email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <Button type="submit" variant="restaurant" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </main>
  );
}
