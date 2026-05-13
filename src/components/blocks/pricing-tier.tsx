"use client";

import { useState } from "react";
import { Check, X, Buildings, ArrowRight, Star, LockKey as Lock, CurrencyCircleDollar as CircleDollarSign } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface PricingFeature { text: string; included: boolean; }
export interface PricingTier {
  id: string; name: string; tagline: string; description: string;
  badge?: string; icon: React.ReactNode; monthlyPrice: number; annualPrice: number;
  features: PricingFeature[];
  cta: string; highlighted: boolean;
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "starter", name: "Starter", tagline: "Just getting started?",
    description: "Build your first product without paying a dime. No tricks, no expiring trials.",
    icon: <CircleDollarSign className="h-5 w-5 shrink-0" />,
    monthlyPrice: 0, annualPrice: 0,
    highlighted: false, cta: "Start for free",
    features: [
      { text: "3 Projects", included: true },
      { text: "5 Team members", included: true },
      { text: "Community support", included: true },
      { text: "Advanced analytics", included: false },
    ],
  },
  {
    id: "pro", name: "Pro", tagline: "For teams that ship.",
    description: "All the tools to grow fast — without spending weekends on infrastructure.",
    badge: "Most Popular",
    icon: <Star className="h-5 w-5 shrink-0" />,
    monthlyPrice: 49, annualPrice: 39,
    highlighted: true, cta: "Start trial",
    features: [
      { text: "Unlimited Projects", included: true },
      { text: "25 Team members", included: true },
      { text: "Priority support", included: true },
      { text: "Advanced analytics", included: true },
    ],
  },
  {
    id: "enterprise", name: "Enterprise", tagline: "Built for scale.",
    description: "Dedicated infrastructure, compliance, and a team that picks up the phone.",
    icon: <Buildings className="h-5 w-5 shrink-0" />,
    monthlyPrice: 149, annualPrice: 119,
    highlighted: false, cta: "Contact sales",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "SSO & SAML", included: true },
      { text: "Custom contracts", included: true },
      { text: "99.9% SLA guarantee", included: true },
    ],
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function PriceDisplay({ price, symbol, isAnnual }: { price: number; symbol: string; isAnnual: boolean }) {
  return (
    <div className="mt-6 mb-1 flex items-baseline gap-1">
      <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">{symbol}{price}</span>
      <span className="text-sm font-medium text-zinc-500">/{isAnnual ? "yr" : "mo"}</span>
    </div>
  );
}

function PricingCard({ tier, isAnnual }: { tier: PricingTier; isAnnual: boolean }) {
  const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl border p-8 bg-white dark:bg-zinc-900 transition-all",
      tier.highlighted 
        ? "border-violet-600 shadow-lg dark:border-violet-500 scale-100" 
        : "border-zinc-200 dark:border-zinc-800"
    )}>
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-violet-600 hover:bg-violet-600 text-white dark:bg-violet-500 border-0">
            {tier.badge}
          </Badge>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {tier.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{tier.name}</h3>
          <p className="text-xs text-zinc-500">{tier.tagline}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{tier.description}</p>
      
      <PriceDisplay price={price} symbol="$" isAnnual={isAnnual} />

      <Button className="mt-8 w-full" variant={tier.highlighted ? "default" : "outline"}>
        {tier.cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <div className="my-8 h-px bg-zinc-100 dark:bg-zinc-800" />

      <ul className="space-y-4">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            {f.included ? (
              <Check className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" weight="bold" />
            ) : (
              <X className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" weight="bold" />
            )}
            <span className={f.included ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-500"}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingTierBlock() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="bg-white px-4 py-24 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-base font-semibold text-violet-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Choose the right plan for you
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Transparent pricing that scales with your business. No hidden fees.
          </p>
        </div>

        <div className="mt-12 flex justify-center items-center gap-4">
          <span className={cn("text-sm font-medium", !isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>Monthly</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={cn("text-sm font-medium", isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>Annual</span>
        </div>

        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-3">
          {DEFAULT_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingTierSkeleton() {
  return <div className="p-24 text-center text-zinc-500">Loading Pricing...</div>;
}
