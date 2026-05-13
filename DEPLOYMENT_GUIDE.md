# 🚀 Engineered UI: Deployment & Distribution Guide

This guide defines the standard operating procedure (SOP) for taking a developed UI block from the "Local Development" stage to the "Final Uploads" (Gumroad/GitHub). 

Follow these steps for every block to ensure we maintain our **$2,235/mo** revenue quality standard.

---

## 🏁 Phase 1: The "Engineered UI" Audit
A block is only "Ready" when it passes these 4 engineering gates.

### 1. Visual & Accessibility Audit
- [ ] **Contrast Check:** Run `npm run a11y` or use Axe DevTools. All text must meet **WCAG AA (4.5:1)**.
- [ ] **Dark Mode Audit:** Ensure `dark:text-white` is used for high-impact text. Verify backgrounds are `dark:bg-zinc-900`.
- [ ] **Logical Properties:** No `ml-*` or `pr-*`. Use `ms-*`, `me-*`, `ps-*`, `pe-*` for universal RTL support.
- [ ] **Motion Polish:** Verify `framer-motion` transitions are hardware-accelerated (`will-change-transform`).

### 2. Technical Validation
- [ ] **RSC First:** Confirm the block is a React Server Component by default.
- [ ] **Prop API:** Ensure the block is highly customizable via props (e.g., `highlightedId`, `currency`, `showSkeleton`).
- [ ] **Zod Schema:** Every form/input must have a corresponding Zod schema for validation.

---

## 🏗️ Phase 2: Tiered Variant Creation
We maximize revenue by offering a "Free-to-Paid" ladder.

### 1. The "Lite" Version (Standard)
*   **Goal:** Drive GitHub stars and build a lead magnet.
*   **Action:** 
    - Strip "Sizzle" animations (3D tilts, magnetic effects).
    - Use standard Tailwind transitions.
    - Save to: `registry/standard/[block-name].tsx`.

### 2. The "Engineered" Version (Premium)
*   **Goal:** Commercial sale on Gumroad.
*   **Action:**
    - Retain all high-end animations (Lava-lamp morphing, cursor tracking).
    - Include advanced "Engineered" features (e.g., Skeleton states, Multi-step logic).
    - Save to: `registry/premium/[block-name].tsx`.

---

## 📸 Phase 3: Marketing Asset Generation
The assets that convert GitHub traffic into customers.

- [ ] **Sizzle Videos:** Record 5-10 second clips (60fps) of the premium interactions.
- [ ] **Visual Proof:** Generate a performance/accessibility scorecard image for the block.
- [ ] **Interactive Preview:** Deploy the block to the demo URL for live testing.

---

## 📝 Phase 4: Documentation & Registry Integration
- [ ] **Update `registry.json`:** Add block metadata, dependencies, and type signatures.
- [ ] **README Update:** Add the block to the `Available Blocks` table in the main repository.
- [ ] **AI-Ready Check:** Verify the block can be installed via `npx shadcn@latest add [block-url]`.

---

## 🚀 Phase 5: Distribution & Launch

### 1. Gumroad Packaging
- [ ] **Package Zip:** Create a `.zip` with the Premium component, registry entry, and basic setup guide.
- [ ] **Product Page:** Use "Human-First" copy (The Tired Developer's Guide).
- [ ] **Tier Setup:** Link the block to the correct tier ($19 Aura, $29 Zenith, or $49 Nova).

### 2. Public Launch
- [ ] **GitHub Release:** Push the Lite version and tag the release.
- [ ] **Community:** Share the Sizzle video on X/Reddit/LinkedIn using the defined outreach strategy.
