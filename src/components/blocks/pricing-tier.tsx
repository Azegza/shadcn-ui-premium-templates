"use client";

import { useState } from "react";
import type { BezierDefinition } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Shield, Crown, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ─── Stripe-Ready Types ─────────────────────────────────────────────────────
export interface StripePriceRef {
  monthly: string;
  annual: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceIds: StripePriceRef;
  features: PricingFeature[];
  cta: string;
  highlighted: boolean;
  variant: "outline" | "default" | "ghost";
}

export interface PricingTierBlockProps {
  /** Override the default tiers */
  tiers?: PricingTier[];
  /** Callback on CTA click — receives tier id and billing period */
  onSelectPlan?: (tierId: string, period: "monthly" | "annual") => void;
  /** Custom class for the section wrapper */
  className?: string;
}

// ─── Default Tier Data ───────────────────────────────────────────────────────
const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for side projects and indie hackers getting started.",
    icon: <Zap className="h-5 w-5" />,
    monthlyPrice: 0,
    annualPrice: 0,
    stripePriceIds: { monthly: "price_free", annual: "price_free" },
    highlighted: false,
    variant: "outline",
    cta: "Start for free",
    features: [
      { text: "3 Projects", included: true },
      { text: "5 Team members", included: true },
      { text: "2 GB Storage", included: true },
      { text: "Community support", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Custom domains", included: false },
      { text: "Priority support", included: false },
      { text: "SLA guarantee", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything a growing SaaS team needs to ship fast.",
    badge: "Most Popular",
    icon: <Crown className="h-5 w-5" />,
    monthlyPrice: 49,
    annualPrice: 39,
    stripePriceIds: {
      monthly: "price_pro_monthly",
      annual: "price_pro_annual",
    },
    highlighted: true,
    variant: "default",
    cta: "Start free trial",
    features: [
      { text: "Unlimited Projects", included: true, highlight: true },
      { text: "25 Team members", included: true },
      { text: "50 GB Storage", included: true },
      { text: "Priority email support", included: true },
      { text: "Advanced analytics", included: true, highlight: true },
      { text: "Custom domains", included: true },
      { text: "Priority support", included: false },
      { text: "SLA guarantee", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Dedicated infrastructure, compliance, and white-glove support.",
    icon: <Shield className="h-5 w-5" />,
    monthlyPrice: 149,
    annualPrice: 119,
    stripePriceIds: {
      monthly: "price_enterprise_monthly",
      annual: "price_enterprise_annual",
    },
    highlighted: false,
    variant: "outline",
    cta: "Talk to sales",
    features: [
      { text: "Unlimited Projects", included: true },
      { text: "Unlimited Team members", included: true, highlight: true },
      { text: "500 GB Storage", included: true },
      { text: "Dedicated Slack channel", included: true },
      { text: "Advanced analytics + exports", included: true },
      { text: "Custom domains + SSL", included: true },
      { text: "24/7 priority support", included: true, highlight: true },
      { text: "99.99% SLA guarantee", included: true, highlight: true },
    ],
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────
const SPRING_EASE: BezierDefinition = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SPRING_EASE } },
};

const priceVariants = {
  enter: { opacity: 0, y: -12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.18 } },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────
function PriceDisplay({
  price,
  period,
}: {
  price: number;
  period: "monthly" | "annual";
}) {
  const isFree = price === 0;

  return (
    <div className="flex items-end gap-1 mt-6 mb-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${price}-${period}`}
          variants={priceVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex items-end gap-1"
        >
          {isFree ? (
            <span className="text-5xl font-bold tracking-tight">Free</span>
          ) : (
            <>
              <span className="text-2xl font-semibold text-muted-foreground mb-1.5">$</span>
              <span className="text-5xl font-bold tracking-tight">{price}</span>
              <span className="text-muted-foreground mb-1.5 text-sm">
                /{period === "monthly" ? "mo" : "mo, billed annually"}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FeatureRow({ feature }: { feature: PricingFeature }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          feature.included
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground/40"
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span
        className={cn(
          feature.included ? "text-foreground" : "text-muted-foreground line-through decoration-muted-foreground/30",
          feature.highlight && feature.included && "font-medium text-primary"
        )}
      >
        {feature.text}
      </span>
    </li>
  );
}

// ─── Main Block ──────────────────────────────────────────────────────────────
export function PricingTierBlock({
  tiers = DEFAULT_TIERS,
  onSelectPlan,
  className,
}: PricingTierBlockProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const period = isAnnual ? "annual" : "monthly";

  const handleSelectPlan = (tierId: string) => {
    onSelectPlan?.(tierId, period);
  };

  return (
    <section
      className={cn("relative w-full px-4 py-24 sm:px-6 lg:px-8", className)}
      aria-label="Pricing plans"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Simple, transparent pricing
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pay for what you need,{" "}
            <span className="text-primary">nothing more</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when your team grows. No hidden fees, no
            surprises on your invoice.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !isAnnual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            aria-label="Toggle annual billing"
          />
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isAnnual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Annual
          </span>
          <AnimatePresence>
            {isAnnual && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -8 }}
                className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                Save up to 20%
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tier Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg",
                tier.highlighted &&
                  "border-primary/50 shadow-primary/10 shadow-lg ring-1 ring-primary/20"
              )}
            >
              {/* Highlighted glow */}
              {tier.highlighted && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent"
                />
              )}

              {/* Popular Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 px-3 py-1 text-xs font-semibold shadow-md">
                    <Sparkles className="h-3 w-3" />
                    {tier.badge}
                  </Badge>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    tier.highlighted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tier.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{tier.name}</h3>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {tier.description}
              </p>

              {/* Price */}
              <PriceDisplay
                price={isAnnual ? tier.annualPrice : tier.monthlyPrice}
                period={period}
              />

              {/* CTA */}
              <Button
                size="lg"
                variant={tier.highlighted ? "default" : "outline"}
                className={cn(
                  "mt-6 w-full gap-2 font-semibold transition-all",
                  tier.highlighted && "shadow-md hover:shadow-primary/25"
                )}
                onClick={() => handleSelectPlan(tier.id)}
                aria-label={`Select ${tier.name} plan`}
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Divider */}
              <div className="my-8 h-px bg-border" />

              {/* Features */}
              <ul className="flex flex-col gap-3.5" role="list">
                {tier.features.map((feature, i) => (
                  <FeatureRow key={i} feature={feature} />
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          No credit card required · Cancel anytime · 14-day free trial on all paid plans
        </motion.p>
      </div>
    </section>
  );
}
