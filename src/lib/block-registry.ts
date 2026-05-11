/**
 * Block Metadata Schema
 * ---------------------
 * Defines the TypeScript types for our block registry.
 * Every block must declare its dependencies, category, and complexity
 * so the registry.json can be generated programmatically as we scale to 50+ blocks.
 */

export interface BlockDependency {
  /** npm package name */
  name: string;
  /** Minimum version required */
  version: string;
  /** Whether this is a peer dependency */
  isPeer?: boolean;
}

export interface BlockMetadata {
  /** Unique identifier matching the registry name (e.g., "pricing-tier") */
  id: string;
  /** Human-readable title */
  title: string;
  /** Short description for the registry and README */
  description: string;
  /** Block category for organization */
  category: "conversion" | "onboarding" | "dashboard" | "data-display" | "navigation" | "feedback";
  /** Complexity tier affects pricing and marketing */
  complexity: "basic" | "intermediate" | "advanced";
  /** npm dependencies required */
  dependencies: BlockDependency[];
  /** shadcn/ui components this block depends on */
  registryDependencies: string[];
  /** File paths relative to src/ */
  files: string[];
  /** Preview route for the block */
  previewRoute: string;
  /** Whether this block is included in the free tier */
  isFree: boolean;
}

/**
 * Registry of all blocks in the product.
 * This is the single source of truth for the entire product catalog.
 */
export const BLOCK_REGISTRY: BlockMetadata[] = [
  {
    id: "pricing-tier",
    title: "SaaS Pricing Tier",
    description:
      "A premium, animated pricing section with Monthly/Annual toggle, highlighted Pro tier, feature comparison, and Stripe-ready TypeScript types.",
    category: "conversion",
    complexity: "advanced",
    dependencies: [
      { name: "framer-motion", version: "^11.0.0" },
      { name: "lucide-react", version: "^0.400.0" },
    ],
    registryDependencies: ["button", "card", "badge", "switch"],
    files: ["components/blocks/pricing-tier.tsx"],
    previewRoute: "/preview/pricing-tier",
    isFree: true,
  },
  {
    id: "onboarding-flow",
    title: "Multi-Step Onboarding Flow",
    description:
      "A secure, multi-step onboarding wizard with progress indicators, animated transitions, and full Zod validation.",
    category: "onboarding",
    complexity: "advanced",
    dependencies: [
      { name: "framer-motion", version: "^11.0.0" },
      { name: "zod", version: "^3.23.0" },
      { name: "react-hook-form", version: "^7.50.0" },
      { name: "@hookform/resolvers", version: "^3.3.0" },
      { name: "lucide-react", version: "^0.400.0" },
    ],
    registryDependencies: ["button", "card", "input", "label", "select"],
    files: ["components/blocks/onboarding-flow.tsx"],
    previewRoute: "/preview/onboarding-flow",
    isFree: true,
  },
  {
    id: "metrics-dashboard",
    title: "Metrics Dashboard Layout",
    description:
      "A responsive SaaS metrics dashboard with sidebar navigation, data cards, and integrated Recharts visualizations.",
    category: "dashboard",
    complexity: "advanced",
    dependencies: [
      { name: "recharts", version: "^2.12.0" },
      { name: "lucide-react", version: "^0.400.0" },
    ],
    registryDependencies: ["button", "card", "avatar", "badge"],
    files: ["components/blocks/metrics-dashboard.tsx"],
    previewRoute: "/preview/metrics-dashboard",
    isFree: true,
  },
];
