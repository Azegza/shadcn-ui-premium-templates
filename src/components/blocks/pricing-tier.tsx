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

// ─── Expanded Props API ───────────────────────────────────────────────────────
export interface PricingTierBlockProps {
  tiers?: PricingTier[];
  showAnnualByDefault?: boolean;
  highlightedTierId?: string;
  currencySymbol?: string;
  showSkeletonWhile?: boolean;
  onSelectPlan?: (tierId: string, period: "monthly" | "annual") => void;
  className?: string;
}

// ─── Default Tier Data ────────────────────────────────────────────────────────
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
      { text: "3 Projects", included: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
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
    stripePriceIds: { monthly: "price_pro_monthly", annual: "price_pro_annual" },
    highlighted: true,
    variant: "default",
    cta: "Start your 14-day trial",
    ctaNote: "Cancel anytime, no questions asked.",
    features: [
      { text: "Unlimited Projects", included: true, highlight: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
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
    stripePriceIds: { monthly: "price_enterprise_monthly", annual: "price_enterprise_annual" },
    highlighted: false,
    variant: "outline",
    cta: "Talk to a human",
    ctaNote: "We'll reply within 2 business hours.",
    features: [
      { text: "Unlimited Projects", included: true, icon: <BarChart3 className="h-3.5 w-3.5 shrink-0" /> },
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

// ─── Animation Variants ───────────────────────────────────────────────────────
const SPRING_EASE: BezierDefinition = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
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

// ─── Skeleton (Fix 3) ─────────────────────────────────────────────────────────
function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700", className)}
      aria-hidden="true"
    />
  );
}

export function PricingTierSkeleton() {
  return (
    <section
      className="relative w-full px-4 py-24 sm:px-6 lg:px-8"
      aria-label="Loading pricing plans"
      aria-busy="true"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4">
          <SkeletonBox className="h-7 w-48 rounded-full" />
          <SkeletonBox className="h-12 w-3/4 max-w-xl" />
          <SkeletonBox className="h-12 w-1/2 max-w-sm" />
          <SkeletonBox className="h-5 w-2/3 max-w-lg" />
          <SkeletonBox className="h-5 w-1/2 max-w-md" />
          <SkeletonBox className="h-8 w-44 rounded-full mt-2" />
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900",
                i === 1 && "lg:-mt-4"
              )}
            >
              <div className="flex items-start gap-3.5">
                <SkeletonBox className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-3 w-32" />
                </div>
              </div>
              <SkeletonBox className="h-4 w-full mt-4" />
              <SkeletonBox className="h-4 w-4/5 mt-2" />
              <SkeletonBox className="h-14 w-40 mt-6" />
              <SkeletonBox className="h-11 w-full mt-6 rounded-xl" />
              <SkeletonBox className="h-3 w-36 mx-auto mt-2" />
              <div className="my-7 h-px bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex flex-col gap-3.5">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <SkeletonBox className="h-5 w-5 rounded-full shrink-0" />
                    <SkeletonBox className={cn("h-3", j % 3 === 0 ? "w-3/4" : "w-1/2")} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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
    <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
      <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
      {note}
    </p>
  );
}

function PriceDisplay({
  price,
  period,
  currencySymbol,
}: {
  price: number;
  period: "monthly" | "annual";
  currencySymbol: string;
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
            // HIGH CONTRAST: explicit white in dark, near-black in light
            <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Free
            </span>
          ) : (
            <>
              <span className="text-2xl font-semibold mb-2 text-zinc-400 dark:text-zinc-400">
                {currencySymbol}
              </span>
              {/* HIGH CONTRAST: price number must be bright white in dark mode */}
              <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {price}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 mb-1.5 text-sm leading-relaxed">
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
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
          feature.included
            // HIGH CONTRAST: use stronger background in dark so icons pop
            ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary"
            : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
        )}
        aria-hidden="true"
      >
        {feature.included ? (
          <Check className="h-3 w-3" strokeWidth={2.5} />
        ) : (
          <X className="h-3 w-3" strokeWidth={2} />
        )}
      </span>
      <span
        className={cn(
          "leading-relaxed",
          feature.included
            // HIGH CONTRAST: included features must be clearly readable
            ? "text-zinc-700 dark:text-zinc-200"
            // HIGH CONTRAST: excluded features struck-through but still visible
            : "text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-300 dark:decoration-zinc-600",
          // Highlighted features get maximum contrast bold
          feature.highlight && feature.included && "font-semibold text-zinc-900 dark:text-white"
        )}
      >
        {feature.text}
      </span>
    </li>
  );
}

// ─── Main Block ───────────────────────────────────────────────────────────────
export function PricingTierBlock({
  tiers = DEFAULT_TIERS,
  showAnnualByDefault = false,
  highlightedTierId,
  currencySymbol = "$",
  showSkeletonWhile = false,
  onSelectPlan,
  className,
}: PricingTierBlockProps) {
  const [isAnnual, setIsAnnual] = useState(showAnnualByDefault);
  const period = isAnnual ? "annual" : "monthly";

  const resolvedTiers = highlightedTierId
    ? tiers.map((t) => ({ ...t, highlighted: t.id === highlightedTierId }))
    : tiers;

  if (showSkeletonWhile) return <PricingTierSkeleton />;

  const handleSelectPlan = (tierId: string) => {
    onSelectPlan?.(tierId, period);
  };

  return (
    <section
      className={cn("relative w-full px-4 py-24 sm:px-6 lg:px-8", className)}
      aria-label="Pricing plans"
    >
      {/* Background: glow + dot grid — boosted opacity for dark mode visibility */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/15" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SPRING_EASE }}
          className="text-center"
        >
          {/* Social proof pill — HIGH CONTRAST explicit dark tokens */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-sm mb-6 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/80">
            <StarRating />
            <span className="font-semibold text-zinc-900 dark:text-white">4.9</span>
            <span className="text-zinc-500 dark:text-zinc-300">from 1,200+ developers</span>
          </div>

          {/* HIGH CONTRAST heading: explicit dark:text-white */}
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Pay for what you need,{" "}
            <span className="text-primary">nothing more</span>
          </h2>
          {/* HIGH CONTRAST body: dark:text-zinc-300 (not muted-foreground) */}
          <p className="mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Honest pricing, no dark patterns. Start free and upgrade when it
            makes sense for your team — not because a trial timer ran out.
          </p>
        </motion.div>

        {/* ── Billing Toggle ── */}
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
                !isAnnual
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
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
                isAnnual
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
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
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 dark:border-emerald-500/40"
                >
                  <CircleDollarSign className="h-3 w-3 shrink-0" strokeWidth={2} />
                  Save up to 20%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {/* HIGH CONTRAST toggle hint */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isAnnual
              ? "Billed once per year. Switch back anytime."
              : "Switch to annual and save two months free."}
          </p>
        </motion.div>

        {/* ── Tier Cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start"
        >
          {resolvedTiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
              className={cn(
                // HIGH CONTRAST card surfaces: explicit dark:bg-zinc-900 + dark:border-zinc-700
                "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-8",
                "border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700",
                // Warm hover — works in both modes
                "transition-all duration-200 hover:shadow-xl",
                "hover:bg-zinc-50 dark:hover:bg-zinc-800/80",
                tier.highlighted &&
                  // HIGH CONTRAST highlighted card: distinct zinc-800 bg in dark
                  "border-primary/40 shadow-lg shadow-primary/10 dark:bg-zinc-800/80 dark:border-primary/50 dark:shadow-primary/10 lg:-mt-4 lg:pb-12"
              )}
            >
              {/* Highlighted gradient overlay */}
              {tier.highlighted && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10"
                />
              )}

              {/* "Most Popular" badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1.5 px-3.5 py-1 text-xs font-semibold shadow-lg whitespace-nowrap">
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
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  )}
                  aria-hidden="true"
                >
                  {tier.icon}
                </span>
                <div>
                  {/* HIGH CONTRAST plan name */}
                  <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 italic">
                    {tier.tagline}
                  </p>
                </div>
              </div>

              {/* HIGH CONTRAST description: dark:text-zinc-300 not muted-foreground */}
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {tier.description}
              </p>

              {/* Price */}
              <PriceDisplay
                price={isAnnual ? tier.annualPrice : tier.monthlyPrice}
                period={period}
                currencySymbol={currencySymbol}
              />

              {/* CTA */}
              <div className="mt-6">
                <Button
                  size="lg"
                  variant={tier.highlighted ? "default" : "outline"}
                  className={cn(
                    "w-full gap-2 font-semibold transition-all",
                    !tier.highlighted &&
                      // HIGH CONTRAST outline button in dark: explicit text color
                      "dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700",
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
              <div
                className="my-7 h-px bg-zinc-200 dark:bg-zinc-700"
                role="separator"
              />

              {/* Features */}
              <ul
                className="flex flex-col gap-3.5"
                role="list"
                aria-label={`${tier.name} features`}
              >
                {tier.features.map((feature, i) => (
                  <FeatureRow key={i} feature={feature} />
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Footer trust signals ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          // HIGH CONTRAST footer: dark:text-zinc-400 (not muted-foreground which can be invisible)
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400"
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
