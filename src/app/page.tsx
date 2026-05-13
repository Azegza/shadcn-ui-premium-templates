"use client";

import { useState } from "react";
import { PricingTierBlock } from "@/components/blocks/pricing-tier";
import { OnboardingFlowBlock } from "@/components/blocks/onboarding-flow";
import { MetricsDashboardBlock } from "@/components/blocks/metrics-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkle, Lightning } from "@phosphor-icons/react";

export default function Home() {
  const [variant, setVariant] = useState<"standard" | "premium">("premium");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* ── Variant Switcher ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Lightning className={variant === "standard" ? "text-amber-500" : "text-zinc-400"} weight="bold" />
          <Label htmlFor="variant-toggle" className="text-sm font-bold">Standard</Label>
        </div>
        <Switch 
          id="variant-toggle" 
          checked={variant === "premium"} 
          onCheckedChange={(checked) => setVariant(checked ? "premium" : "standard")} 
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="variant-toggle" className="text-sm font-bold">Premium</Label>
          <Sparkle className={variant === "premium" ? "text-violet-500" : "text-zinc-400"} weight="bold" />
        </div>
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
        <Badge variant={variant === "premium" ? "default" : "secondary"} className="h-6">
          {variant === "premium" ? "2026 Sizzle Enabled" : "Lite Mode"}
        </Badge>
      </div>

      <main className="w-full">
        <Tabs defaultValue="aura" className="w-full">
          <div className="flex items-center justify-center pt-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <TabsList className="bg-transparent gap-8 h-14">
              <TabsTrigger value="aura" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none h-full px-4 font-bold transition-all">
                Aura Pricing
              </TabsTrigger>
              <TabsTrigger value="zenith" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none h-full px-4 font-bold transition-all">
                Zenith Onboarding
              </TabsTrigger>
              <TabsTrigger value="nova" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none h-full px-4 font-bold transition-all">
                Nova Dashboard
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="aura" className="mt-0">
            <PricingTierBlock variant={variant} />
          </TabsContent>
          
          <TabsContent value="zenith" className="mt-0">
            <OnboardingFlowBlock variant={variant} />
          </TabsContent>
          
          <TabsContent value="nova" className="mt-0">
            <MetricsDashboardBlock variant={variant} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
