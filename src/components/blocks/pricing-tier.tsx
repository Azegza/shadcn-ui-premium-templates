"use client";

import { useState } from "react";
import type { BezierDefinition } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Zap,
  ShieldCheck,
  Crown,
  ArrowRight,
  Star,
  TrendingUp,
  Lock,
  Users,
  Headphones,
  BarChart3,
  Globe,
  CircleDollarSign,
} from "lucide-react";
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
  icon?: React.ReactNode;
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceIds: StripePriceRef;
  features: PricingFeature[];
  cta: string;
  ctaNote?: string;
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
    tagline: "Just getting started?",
    description:
      "Build your first product without paying a dime. No tricks, no expiring trials.",
    icon: <Zap className="h-5 w-5 shrink-0" strokeWidth={1.5} />,
    monthlyPrice: 0,
    annualPrice: 0,
    stripePriceIds: { monthly: "price_free", annual: "price_free" },
    highlighted: false,
    variant: "outline",
    cta: "Start building, it's free",
    ctaNote: "No credit card. No gotchas.",
    features: [
      { text: "3 Projects", included: true, icon: <TrendingUp className="h-3.5 w-3.5 shrink-0" /> },
      { text: "5 Team members", included: true, icon: <Users className="h-3.5 w-3.5 shrink-0" /> },
      { text: "2 GB Storage", included: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Community support", included: true, icon: <Headphones className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Advanced analytics", included: false },
      { text: "Custom domains", included: false },
      { text: "Priority support", included: false },
      { text: "SLA guarantee", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For teams that ship.",
    description:
      "All the tools you need to grow fast — without spending your weekends on infrastructure.",
    badge: "Most Popular",
    icon: <Crown className="h-5 w-5 shrink-0" strokeWidth={1.5} />,
    monthlyPrice: 49,
    annualPrice: 39,
    stripePriceIds: {
      monthly: "price_pro_monthly",
      annual: "price_pro_annual",
    },
    highlighted: true,
    variant: "default",
    cta: "Start your 14-day trial",
    ctaNote: "Cancel anytime, no questions asked.",
    features: [
      { text: "Unlimited Projects", included: true, highlight: true, icon: <TrendingUp className="h-3.5 w-3.5 shrink-0" /> },
      { text: "25 Team members", included: true, icon: <Users className="h-3.5 w-3.5 shrink-0" /> },
      { text: "50 GB Storage", included: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Priority email support", included: true, icon: <Headphones className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Advanced analytics", included: true, highlight: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Custom domains", included: true, icon: <Globe className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Priority support", included: false },
      { text: "SLA guarantee", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Built for scale.",
    description:
      "Dedicated infrastructure, compliance tooling, and a team that actually picks up the phone.",
    icon: <ShieldCheck className="h-5 w-5 shrink-0" strokeWidth={1.5} />,
    monthlyPrice: 149,
    annualPrice: 119,
    stripePriceIds: {
      monthly: "price_enterprise_monthly",
      annual: "price_enterprise_annual",
    },
    highlighted: false,
    variant: "outline",
    cta: "Talk to a human",
    ctaNote: "We'll reply within 2 business hours.",
    features: [
      { text: "Unlimited Projects", included: true, icon: <TrendingUp className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Unlimited Team members", included: true, highlight: true, icon: <Users className="h-3.5 w-3.5 shrink-0" /> },
      { text: "500 GB Storage", included: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Dedicated Slack channel", included: true, icon: <Headphones className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Analytics + full data export", included: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
      { text: "Custom domains + SSL", included: true, icon: <Globe className="h-3.5 w-3.5 shrink-0" /> },
      { text: "24/7 priority support", included: true, highlight: true, icon: <Headphones className="h-3.5 w-3.5 shrink-0" /> },
      { text: "99.99% SLA guarantee", included: true, highlight: true, icon: <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> },
    ],
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────
const SPRING_EASE: BezierDefinition = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: SPRING_EASE } },
};

const priceVariants = {
  enter: { opacity: 0, y: -14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
  exit: { opacity: 0, y: 14, transition: { duration: 0.18 } },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
      ))}
    </span>
  );
}

function TrustRow({ note }: { note: string }) {
  return (
    <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
      {note}
    </p>
  );
}

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
              <span className="text-2xl font-semibold text-muted-foreground mb-2">$</span>
              <span className="text-5xl font-bold tracking-tight">{price}</span>
              <span className="text-muted-foreground mb-1.5 text-sm leading-relaxed">
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
    <li className="flex items-start gap-3 text-sm">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          feature.included
            ? "bg-primary/10 text-primary"
            : "bg-muted/60 text-muted-foreground/30"
        )}
        aria-hidden="true"
      >
        {feature.included
          ? <Check className="h-3 w-3" strokeWidth={2.5} />
          : <X className="h-3 w-3" strokeWidth={2} />
        }
      </span>
      <span
        className={cn(
          "leading-relaxed",
          feature.included
            ? "text-foreground"
            : "text-muted-foreground/50 line-through decoration-muted-foreground/20",
          feature.highlight && feature.included && "font-semibold text-foreground"
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
      {/* Background: soft radial glow + subtle dot grid for texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SPRING_EASE }}
          className="text-center"
        >
          {/* Social proof pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground mb-6 shadow-sm backdrop-blur-sm">
            <StarRating />
            <span className="font-semibold text-foreground">4.9</span>
            from 1,200+ developers
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Pay for what you need,{" "}
            <span className="text-primary">nothing more</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Honest pricing, no dark patterns. Start free and upgrade when it makes sense for
            your team — not because a trial timer ran out.
          </p>
        </motion.div>

        {/* ── Billing Toggle ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-sm font-semibold transition-colors",
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
                "text-sm font-semibold transition-colors",
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
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  <CircleDollarSign className="h-3 w-3 shrink-0" strokeWidth={2} />
                  Save up to 20%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground">
            {isAnnual ? "Billed once per year. Switch back anytime." : "Switch to annual and save two months free."}
          </p>
        </motion.div>

        {/* ── Tier Cards ──────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm",
                "transition-all duration-200 hover:shadow-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/60",
                tier.highlighted &&
                  "border-primary/40 shadow-lg shadow-primary/10 ring-1 ring-primary/20 md:-mt-4 md:pb-12"
              )}
            >
              {/* Highlighted gradient overlay */}
              {tier.highlighted && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 via-transparent to-transparent"
                />
              )}

              {/* "Most Popular" badge — floats above card */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1.5 px-3.5 py-1 text-xs font-semibold shadow-lg">
                    <Star className="h-3 w-3 fill-current shrink-0" strokeWidth={0} />
                    {tier.badge}
                  </Badge>
                </div>
              )}

              {/* Plan icon + name + tagline */}
              <div className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    tier.highlighted
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {tier.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold tracking-tight">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{tier.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {tier.description}
              </p>

              {/* Price display */}
              <PriceDisplay
                price={isAnnual ? tier.annualPrice : tier.monthlyPrice}
                period={period}
              />

              {/* CTA button + human trust note */}
              <div className="mt-6">
                <Button
                  size="lg"
                  variant={tier.highlighted ? "default" : "outline"}
                  className={cn(
                    "w-full gap-2 font-semibold transition-all",
                    tier.highlighted && "shadow-md hover:shadow-lg hover:shadow-primary/20"
                  )}
                  onClick={() => handleSelectPlan(tier.id)}
                  aria-label={`Select ${tier.name} plan`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
                {tier.ctaNote && <TrustRow note={tier.ctaNote} />}
              </div>

              {/* Divider */}
              <div className="my-7 h-px bg-border/70" role="separator" />

              {/* Feature list */}
              <ul className="flex flex-col gap-3.5" role="list" aria-label={`${tier.name} features`}>
                {tier.features.map((feature, i) => (
                  <FeatureRow key={i} feature={feature} />
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Footer trust row ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          {[
            { icon: <Lock className="h-4 w-4 shrink-0" />, label: "SOC 2 compliant" },
            { icon: <ShieldCheck className="h-4 w-4 shrink-0" />, label: "99.9% uptime SLA" },
            { icon: <Headphones className="h-4 w-4 shrink-0" />, label: "Real humans on support" },
            { icon: <CircleDollarSign className="h-4 w-4 shrink-0" />, label: "30-day money-back guarantee" },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              {icon}
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
