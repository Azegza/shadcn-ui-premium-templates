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
        {/* Dev toolbar */}
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur-sm">
          <span className="text-xs font-mono text-muted-foreground">
            preview / pricing-tier
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
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
              className="gap-1.5 text-xs"
            >
              {isDark ? (
                <Sun className="h-3.5 w-3.5" />
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
