import { Metadata } from "next";
import { PricingTierPreview } from "./pricing-tier-preview";

export const metadata: Metadata = {
  title: "Pricing Tier",
  description: "A premium, animated pricing section with Monthly/Annual toggle and feature comparison.",
};

export default function PricingTierPreviewPage() {
  return <PricingTierPreview />;
}
