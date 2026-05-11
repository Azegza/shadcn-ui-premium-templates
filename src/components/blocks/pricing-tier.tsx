"use client";

import { useState, useEffect, useRef } from "react";
import type { BezierDefinition } from "framer-motion";
import { motion, AnimatePresence, animate, useMotionValue, useMotionTemplate, useTransform, useSpring } from "framer-motion";
import { Check, X, Zap, ShieldCheck, Crown, ArrowRight, Star, Lock, Headphones, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface StripePriceRef { monthly: string; annual: string; }
export interface PricingFeature { text: string; included: boolean; highlight?: boolean; }
export interface PricingTier {
  id: string; name: string; tagline: string; description: string;
  badge?: string; icon: React.ReactNode; monthlyPrice: number; annualPrice: number;
  stripePriceIds: StripePriceRef; features: PricingFeature[];
  cta: string; ctaNote?: string; highlighted: boolean;
}
export interface PricingTierBlockProps {
  tiers?: PricingTier[];
  showAnnualByDefault?: boolean;
  highlightedTierId?: string;
  currencySymbol?: string;
  showSkeletonWhile?: boolean;
  onSelectPlan?: (tierId: string, period: "monthly" | "annual") => void;
  className?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "starter", name: "Starter", tagline: "Just getting started?",
    description: "Build your first product without paying a dime. No tricks, no expiring trials.",
    icon: <Zap className="h-5 w-5 shrink-0" strokeWidth={1.5} />,
    monthlyPrice: 0, annualPrice: 0,
    stripePriceIds: { monthly: "price_free", annual: "price_free" },
    highlighted: false, cta: "Start building, it's free", ctaNote: "No credit card. No gotchas.",
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
    id: "pro", name: "Pro", tagline: "For teams that ship.",
    description: "All the tools to grow fast — without spending weekends on infrastructure.",
    badge: "Most Popular",
    icon: <Crown className="h-5 w-5 shrink-0" strokeWidth={1.5} />,
    monthlyPrice: 49, annualPrice: 39,
    stripePriceIds: { monthly: "price_pro_monthly", annual: "price_pro_annual" },
    highlighted: true, cta: "Start your 14-day trial", ctaNote: "Cancel anytime, no questions asked.",
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
    id: "enterprise", name: "Enterprise", tagline: "Built for scale.",
    description: "Dedicated infrastructure, compliance, and a team that picks up the phone.",
    icon: <ShieldCheck className="h-5 w-5 shrink-0" strokeWidth={1.5} />,
    monthlyPrice: 149, annualPrice: 119,
    stripePriceIds: { monthly: "price_enterprise_monthly", annual: "price_enterprise_annual" },
    highlighted: false, cta: "Talk to a human", ctaNote: "We'll reply within 2 business hours.",
    features: [
      { text: "Unlimited Projects", included: true },
      { text: "Unlimited Team members", included: true, highlight: true },
      { text: "500 GB Storage", included: true },
      { text: "Dedicated Slack channel", included: true },
      { text: "Analytics + full data export", included: true },
      { text: "Custom domains + SSL", included: true },
      { text: "24/7 priority support", included: true, highlight: true },
      { text: "99.99% SLA guarantee", included: true, highlight: true },
    ],
  },
];

// ─── Animation constants ───────────────────────────────────────────────────
const SPRING: BezierDefinition = [0.22, 1, 0.36, 1];
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SPRING } },
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

// ─── Price Display (Optimized for performance) ────────────────────────────────
function PriceDisplay({ price, period, symbol }: { price: number; period: string; symbol: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    const ctrl = animate(count, price, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => ctrl.stop();
  }, [price, count]);

  return (
    <div className="mt-6 mb-1 flex items-end gap-1 h-[64px]">
      {price === 0
        ? <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">Free</span>
        : <>
            <span className="mb-2 text-2xl font-semibold text-zinc-400">{symbol}</span>
            <motion.span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">{rounded}</motion.span>
            <span className="mb-1.5 text-sm text-zinc-500 dark:text-zinc-400">/{period === "annual" ? "mo, billed annually" : "mo"}</span>
          </>
      }
    </div>
  );
}

// ─── Spinning gradient border (the $49 differentiator) ──────────────────────
function SpinningBorder() {
  return (
    <div className="pointer-events-none absolute -inset-[1px] rounded-[17px] overflow-hidden" aria-hidden="true">
      <div
        className="animate-border-spin absolute left-1/2 top-1/2 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(139,92,246,1) 15deg, rgba(59,130,246,1) 30deg, transparent 40deg)",
        }}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700", className)} aria-hidden="true" />;
}
export function PricingTierSkeleton() {
  return (
    <section className="relative w-full px-4 py-24 sm:px-6 lg:px-8" aria-label="Loading pricing" aria-busy="true">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4">
          <Bone className="h-7 w-48 rounded-full" />
          <Bone className="h-12 w-3/4 max-w-xl" />
          <Bone className="h-5 w-2/3 max-w-lg" />
          <Bone className="h-8 w-44 rounded-full mt-2" />
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900", i === 1 && "lg:-mt-4")}>
              <div className="flex gap-3.5"><Bone className="h-10 w-10 shrink-0 rounded-xl" /><div className="flex-1 space-y-2"><Bone className="h-4 w-24" /><Bone className="h-3 w-32" /></div></div>
              <Bone className="h-4 w-full mt-4" /><Bone className="h-14 w-32 mt-6" /><Bone className="h-11 w-full mt-6 rounded-xl" />
              <div className="my-7 h-px bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-3.5">{[0,1,2,3,4,5,6,7].map((j) => <div key={j} className="flex gap-3"><Bone className="h-5 w-5 shrink-0 rounded-full" /><Bone className={cn("h-3", j % 3 === 0 ? "w-3/4" : "w-1/2")} /></div>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarRating() {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label="4.9 out of 5 stars">
      {[0,1,2,3,4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />)}
    </span>
  );
}

function FeatureRow({ feature }: { feature: PricingFeature }) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        feature.included ? "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
      )} aria-hidden="true">
        {feature.included ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <X className="h-3 w-3" strokeWidth={2} />}
      </span>
      <span className={cn("leading-relaxed",
        feature.included ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-300 dark:decoration-zinc-600",
        feature.highlight && feature.included && "font-semibold text-zinc-900 dark:text-white"
      )}>{feature.text}</span>
    </li>
  );
}



// ─── Pricing Card (Interactive Sizzle) ───────────────────────────────────────
function PricingCard({ tier, isAnnual, period, currencySymbol, onSelectPlan }: { tier: PricingTier; isAnnual: boolean; period: string; currencySymbol: string; onSelectPlan?: (id: string, period: string) => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 3D Magnetic Tilt Effect (2026 standard)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothTiltX = useSpring(tiltX, springConfig);
  const smoothTiltY = useSpring(tiltY, springConfig);
  const rotateX = useTransform(smoothTiltY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothTiltX, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Spotlight coordinates
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    
    // Tilt coordinates (-0.5 to 0.5)
    tiltX.set((clientX - left) / width - 0.5);
    tiltY.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div
      variants={cardVariants}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("group relative z-10", tier.highlighted && "lg:-mt-4")}
    >
      {/* 3D Depth Shadow on Hover */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 rounded-2xl bg-violet-500/0 blur-xl transition-colors duration-500 group-hover:bg-violet-500/15" />
      {/* Spinning gradient border — only on highlighted */}
      {tier.highlighted && <SpinningBorder />}

      {/* Card surface */}
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 sm:p-8 transition-colors duration-300",
          "bg-white dark:bg-zinc-900",
          tier.highlighted
            ? "border-transparent dark:bg-zinc-900 lg:pb-12"
            : "border-zinc-200 shadow-sm dark:border-zinc-700 dark:hover:bg-zinc-800/60"
        )}
      >
        {/* Interactive Mouse Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                ${tier.highlighted ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.06)"},
                transparent 80%
              )
            `,
          }}
        />

        {/* Inner glow on highlighted */}
        {tier.highlighted && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-blue-500/5 dark:from-violet-400/10" />
        )}

        {/* Subtle glass noise texture */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay dark:opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

        {/* Content */}
        <div className="relative z-10">
          {tier.badge && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="gap-1.5 whitespace-nowrap bg-gradient-to-r from-violet-600 to-blue-500 px-3.5 py-1 text-xs font-semibold text-white shadow-lg shadow-violet-500/30 border-0">
                <Star className="h-3 w-3 fill-current shrink-0" strokeWidth={0} /> {tier.badge}
              </Badge>
            </div>
          )}

          <div className="flex items-start gap-3.5">
            <span
              className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                tier.highlighted
                  ? "bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              )}
              aria-hidden="true"
            >
              {tier.icon}
            </span>
            <div>
              <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">{tier.name}</h3>
              <p className="mt-0.5 text-xs italic text-zinc-500 dark:text-zinc-400">{tier.tagline}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{tier.description}</p>

          <PriceDisplay price={isAnnual ? tier.annualPrice : tier.monthlyPrice} period={period} symbol={currencySymbol} />

          <div className="mt-6">
            <div className="relative overflow-hidden rounded-xl">
              <Button size="lg"
                className={cn("relative w-full gap-2 font-semibold transition-all duration-300",
                  tier.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:opacity-95 border-0 group-hover:scale-[1.02]"
                    : "dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700 group-hover:border-violet-500/30"
                )}
                variant={tier.highlighted ? "default" : "outline"}
                onClick={() => onSelectPlan?.(tier.id, period)}
                aria-label={`Select ${tier.name} plan`}
              >
                {tier.highlighted && <span aria-hidden="true" className="animate-shimmer pointer-events-none absolute inset-0 w-1/3 bg-white/20 blur-sm" />}
                {tier.cta}
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            {tier.ctaNote && (
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />{tier.ctaNote}
              </p>
            )}
          </div>

          <div className="my-7 h-px bg-zinc-200 dark:bg-zinc-700" role="separator" />

          <ul className="flex flex-col gap-3.5" role="list" aria-label={`${tier.name} features`}>
            {tier.features.map((f, i) => <FeatureRow key={i} feature={f} />)}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main block ───────────────────────────────────────────────────────────────
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
  const resolved = highlightedTierId ? tiers.map((t) => ({ ...t, highlighted: t.id === highlightedTierId })) : tiers;

  if (showSkeletonWhile) return <PricingTierSkeleton />;

  return (
    <section className={cn("relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8", className)} aria-label="Pricing plans">

      {/* ── Floating orbs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-float-a absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15" />
        <div className="animate-float-b absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-400/10" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: SPRING }} className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/80">
            <StarRating />
            <span className="font-semibold text-zinc-900 dark:text-white">4.9</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-300">from 1,200+ developers</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl overflow-hidden pb-2">
            <motion.span
              initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="inline-block"
            >
              Pay for what you need,
            </motion.span>
            <br />
            {/* ── Animated gradient text ── */}
            <motion.span
              initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="inline-block animate-gradient-flow bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #7c3aed, #3b82f6, #8b5cf6, #06b6d4, #7c3aed)" }}
            >
              nothing more
            </motion.span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            Honest pricing, no dark patterns. Start free and upgrade when it makes sense for your team — not because a trial timer ran out.
          </p>
        </motion.div>

        {/* ── Billing toggle ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }} className="mt-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-semibold transition-colors", !isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500")}>Monthly</span>
            <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle annual billing" />
            <span className={cn("text-sm font-semibold transition-colors", isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500")}>Annual</span>
            <AnimatePresence>
              {isAnnual && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300">
                  <CircleDollarSign className="h-3 w-3 shrink-0" strokeWidth={2} /> Save up to 20%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isAnnual ? "Billed once a year. Switch back anytime." : "Switch to annual and save two months free."}
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {resolved.map((tier) => (
            <PricingCard key={tier.id} tier={tier} isAnnual={isAnnual} period={period} currencySymbol={currencySymbol} onSelectPlan={onSelectPlan} />
          ))}
        </motion.div>
        {/* ── Trust footer ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
          {[
            { icon: <Lock className="h-4 w-4 shrink-0" />, label: "SOC 2 compliant" },
            { icon: <ShieldCheck className="h-4 w-4 shrink-0" />, label: "99.9% uptime SLA" },
            { icon: <Headphones className="h-4 w-4 shrink-0" />, label: "Real humans on support" },
            { icon: <CircleDollarSign className="h-4 w-4 shrink-0" />, label: "30-day money-back guarantee" },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">{icon}{label}</span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
