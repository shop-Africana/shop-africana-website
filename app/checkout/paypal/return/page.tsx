import { Suspense } from "react";
import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { Container } from "@/components/ui/Container";
import { PayPalReturnHandler } from "../PayPalReturnHandler";

export default function PayPalReturnPage() {
  return (
    <SharedPageShell>
      <section className="py-12 sm:py-16">
        <Container>
          <Suspense
            fallback={
              <div className="mx-auto max-w-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
                <h1 className="text-3xl font-extrabold text-[var(--color-shop-900)]">
                  Confirming PayPal Payment
                </h1>
              </div>
            }
          >
            <PayPalReturnHandler />
          </Suspense>
        </Container>
      </section>
    </SharedPageShell>
  );
}
