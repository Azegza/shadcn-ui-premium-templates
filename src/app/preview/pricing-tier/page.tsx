"use client";

import { useState } from "react";
import { Moon, Sun, Loader2 } from "lucide-react";
import { PricingTierBlock, PricingTierSkeleton } from "@/components/blocks/pricing-tier";
import { Button } from "@/components/ui/button";

export default function PricingTierPreviewPage() {
  const [isDark, setIsDark] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const simulateSkeleton = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2500);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <main className="min-h-screen bg-background transition-colors duration-300">
        {/* Dev toolbar (Preview Sandbox Only - NOT for production) */}
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
              preview / pricing-tier
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              DEV SANDBOX
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              onClick={simulateSkeleton}
            >
              <Loader2 className="h-3.5 w-3.5" />
              Simulate skeleton
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDark((d) => !d)}
              aria-label="Toggle dark mode"
              className="gap-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {isDark ? (
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
              {isDark ? "Light mode" : "Dark mode"}
            </Button>
          </div>
        </div>

        {showSkeleton ? (
          <PricingTierSkeleton />
        ) : (
          <PricingTierBlock showAnnualByDefault={false} />
        )}
      </main>
    </div>
  );
}
