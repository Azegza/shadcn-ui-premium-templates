import { Metadata } from "next";
import { OnboardingFlowBlock } from "@/components/blocks/onboarding-flow";

export const metadata: Metadata = {
  title: "Onboarding Flow",
  description: "A secure, multi-step onboarding wizard with progress indicators.",
};

export default function OnboardingPreviewPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <OnboardingFlowBlock />
    </main>
  );
}
