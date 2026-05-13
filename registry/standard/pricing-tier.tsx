"use client";

import { useState } from "react";
import { Check, X, Buildings, ShieldCheck, ArrowRight, Star, LockKey as Lock, Headphones, CurrencyCircleDollar as CircleDollarSign } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Feature {
  text: string;
  included: boolean;
  tooltip?: string;
}

interface Tier {
  id: string;
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  description: string;
  features: Feature[];
  buttonText: string;
  highlighted?: boolean;
  badge?: string;
  icon: any;
}

// ─── Components ─────────────────────────────────────────────────────────────

function PriceDisplay({ price, period, symbol }: { price: number; period: string; symbol: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">{symbol}{price}</span>
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">/{period}</span>
    </div>
  );
}

function PricingCard({ tier, isAnnual }: { tier: Tier; isAnnual: boolean }) {
  const price = isAnnual ? tier.price.annual : tier.price.monthly;
  const period = isAnnual ? "yr" : "mo";

  return (
    <Card className={cn(
      "relative flex flex-col transition-all duration-200",
      tier.highlighted 
        ? "border-2 border-violet-600 shadow-lg scale-105 z-10 dark:border-violet-500" 
        : "border-zinc-200 shadow-sm hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
    )}>
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-violet-600 hover:bg-violet-600 text-white dark:bg-violet-500">
            {tier.badge}
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <tier.icon size={24} weight="duotone" />
        </div>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-6">
        <PriceDisplay price={price} period={period} symbol="$" />
        
        <ul className="space-y-3">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              {feature.included ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" weight="bold" />
              ) : (
                <X className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" weight="bold" />
              )}
              <span className={cn(
                feature.included ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-500"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={cn(
            "w-full font-semibold",
            tier.highlighted 
              ? "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md" 
              : "variant-outline"
          )}
          variant={tier.highlighted ? "default" : "outline"}
        >
          {tier.buttonText}
          <ArrowRight className="ms-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Main Block ─────────────────────────────────────────────────────────────

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for side projects and small experiments.",
    icon: CircleDollarSign,
    buttonText: "Start for free",
    features: [
      { text: "Up to 3 projects", included: true },
      { text: "Basic analytics", included: true },
      { text: "Community support", included: true },
      { text: "Custom domains", included: false },
      { text: "Advanced security", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 29, annual: 240 },
    description: "For growing teams that need more power.",
    icon: Star,
    badge: "Most Popular",
    highlighted: true,
    buttonText: "Get Started",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Real-time analytics", included: true },
      { text: "Priority support", included: true },
      { text: "Custom domains", included: true },
      { text: "Advanced security", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 99, annual: 990 },
    description: "Scale with confidence and dedicated support.",
    icon: Buildings,
    buttonText: "Contact Sales",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "SSO & SAML", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom contracts", included: true },
      { text: "99.9% Uptime SLA", included: true },
    ],
  },
];

export function PricingTierStandard() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="bg-white px-4 py-24 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-base font-semibold text-violet-600 dark:text-violet-500">Pricing</h2>
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
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
            Save 20%
          </Badge>
        </div>

        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-3">
          {TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  );
}
