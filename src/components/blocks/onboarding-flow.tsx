import { OnboardingClient } from "./onboarding-flow-client";

export function OnboardingFlowBlock() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-50 px-4 py-24 dark:bg-zinc-950 sm:px-6 lg:px-8">
      {/* ── Dynamic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Animated gradients using transforms to prevent layout thrashing */}
        <div className="absolute top-[-10%] start-[-10%] h-[500px] w-[500px] animate-float-a rounded-full bg-violet-600/10 blur-[120px] will-change-transform" />
        <div className="absolute bottom-[-10%] end-[-10%] h-[500px] w-[500px] animate-float-b rounded-full bg-blue-600/10 blur-[120px] will-change-transform" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <OnboardingClient />
      </div>
    </section>
  );
}
