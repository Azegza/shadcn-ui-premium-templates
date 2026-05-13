"use client";

import { PricingTierBlock } from "@/components/blocks/pricing-tier";
import { OnboardingFlowBlock } from "@/components/blocks/onboarding-flow";
import { MetricsDashboardBlock } from "@/components/blocks/metrics-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
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
            <PricingTierBlock />
          </TabsContent>
          
          <TabsContent value="zenith" className="mt-0">
            <OnboardingFlowBlock />
          </TabsContent>
          
          <TabsContent value="nova" className="mt-0">
            <MetricsDashboardBlock />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
