import { PricingTierBlock } from "@/components/blocks/pricing-tier";

export const metadata = {
  title: "SaaS Pricing Tier – Premium Shadcn Block",
  description:
    "A production-ready, animated SaaS pricing section with Stripe-ready types, billing toggle, and dark mode support.",
};

export default function PricingTierPreviewPage() {
  return (
    <main className="min-h-screen bg-background">
      <PricingTierBlock />
    </main>
  );
}
