---
target: homepage (src/routes/index.tsx)
total_score: 31
p0_count: 1
p1_count: 2
timestamp: 2026-07-19T06-27-42Z
slug: src-routes-index-tsx
---
Method: dual-agent (A: ses_086f2d4e7ffecQKhSiIYmsJvuE · B: ses_0892727b0ffeiR6eTQmIS6Y30G)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress bar + section dots work well, but no image loading states |
| 2 | Match System / Real World | 4 | Exhibition metaphor is cohesive; language is warm and editorial |
| 3 | User Control and Freedom | 3 | ⌘K palette + lightbox keyboard nav are solid; sketch mode is undiscoverable |
| 4 | Consistency and Standards | 2 | Eyebrow on every section flattens hierarchy; two theme toggles; no mobile nav |
| 5 | Error Prevention | 4 | Hard to make errors on a one-page site; localStorage falls back gracefully |
| 6 | Recognition Rather Than Recall | 3 | Section dots help; mobile has no nav — user must recall order by scrolling |
| 7 | Flexibility and Efficiency | 4 | ⌘K palette is excellent; multiple navigation paths; sketch mode is a delight |
| 8 | Aesthetic and Minimalist Design | 2 | Beautiful type/color undermined by eyebrow repetition, 40-skill dump, shadows, busy dock |
| 9 | Error Recovery | 4 | 404 page and error boundary are on-brand and functional |
| 10 | Help and Documentation | 2 | ⌘K not explained; sketch mode has zero onboarding; no tooltips on dock buttons |
| **Total** | | **31/40** | **Good — address weak areas, solid foundation** |

---

## Anti-Patterns Verdict

**LLM assessment**: Borderline human — template residues present. The repetitive eyebrow scaffolding and shadow violations on UI chrome suggest a template-driven process or insufficient editorial passes. The craft in typography, color, and interaction design (custom cursor, ⌘K palette, sketch mode) signals a real designer, but the reflexes (eyebrow on every section, hero metrics, 40-tag skill dump) are AI/template tells.

**Deterministic scan** (Assessment B, exit code 0 — clean): Found 5 advisory `design-system-font-size` hits (10px labels, 8rem/9rem hero sizing) and 2 `overused-font` warnings for Fraunces — all identified as false positives, deliberate editorial choices. The one genuine issue found: **missing focus indicators** on interactive elements across all pages — no `focus-visible` or focus ring Tailwind variants.

---

## Overall Impression

This is a portfolio that knows what it wants to be — warm, editorial, exhibition-like — and largely succeeds. The Fraunces/Inter pairing, OKLCH palette with terracotta anchor, tonal layering, and interaction flourishes (⌘K, custom cursor, sketch overlay) are genuinely distinctive and well-executed. The biggest gap is between the system's stated rules (DESIGN.md) and what's actually shipped: the eyebrow label appears on every section despite the spec forbidding it, shadows appear on UI chrome despite the flat-by-default rule, and the skills section dumps 40 tags in a way that reads more resume than exhibition. Fixing the rule violations and trimming the inventory would raise this from "good" to "excellent."

---

## What's Working

1. **Typography system is genuinely distinctive.** Fraunces/Inter/JetBrains Mono with the `editorial-h` utility gives the page a magazine-gallery voice that most portfolios lack. The fluid hero scaling is bold and controlled.

2. **Interaction design goes beyond expected.** Custom cursor, ⌘K command palette, scroll progress bar, section dots with hover labels, and sketch overlay signal a designer who cares about craft beyond the surface. These are the hardest things to get right.

3. **Tonal layering works where applied.** Ivory → warm-gray → white alternation creates depth without shadows. OKLCH color values show discipline. The terracotta `::selection` color is a thoughtful detail.

---

## Priority Issues

### P0: Repetitive eyebrow label above every section
**What**: Every section (Hero, Work, Archive, Timeline, Skills, About, Contact) opens with `<p className="eyebrow">`. DESIGN.md §6 Don'ts explicitly bans this.
**Why**: The single most visible template tell. Makes each section feel mechanically identical, undermining the exhibition metaphor.
**Fix**: Keep eyebrow only where it adds metadata (hero: "A digital exhibition · 2013 — Present"; work: "Selected Work · 2020 — 2024"). Drop from Timeline, Skills, About, Contact.
**Suggested command**: `/impeccable quieter index.tsx`

### P1: Box-shadows on StatusBar and CommandPalette violate tonal-layering contract
**What**: StatusBar and CommandPalette in `app-shell.tsx` use shadow tokens. DESIGN.md: *"Don't use box-shadows or drop-shadows anywhere. Use tonal layering for depth."*
**Why**: The flat-by-default rule is a core design principle. Shadows on prominent UI chrome undermine the entire system.
**Fix**: Replace shadows with tonal elevation (slightly warmer bg, darker backdrop overlay).
**Suggested command**: `/impeccable polish app-shell.tsx`

### P1: 40 skill tags create an inventory dump
**What**: 8 categories × ~5 items = 40 chip tags in a single section.
**Why**: Emotional dip from narrative journey to checklist. Reads as resume dump, contradicting "exhibition, not CV" positioning.
**Fix**: Show only category headers; reveal items on click/hover. Or reduce to 4 most distinctive categories.
**Suggested command**: `/impeccable distill Skills section`

### P2: No navigation on mobile
**What**: Nav links are `hidden md:flex`. Mobile users see only logo + Theme toggle.
**Why**: Recruiters on mobile must scroll the entire page. Bottom dock is small and cryptic.
**Fix**: Add a hamburger menu or condensed section selector in the fixed header below md breakpoint.
**Suggested command**: `/impeccable adapt src/routes/index.tsx`

### P2: Duplicate theme toggles with inconsistent labels
**What**: Header has "Theme" text button; bottom dock has "◐" symbol. Both call `toggleTheme()`. Neither shows current state.
**Why**: Confusion and redundancy.
**Fix**: Remove one. Keep the dock version, label it with a sun/moon icon.
**Suggested command**: `/impeccable polish app-shell.tsx`

### P3: Lightbox renders without null check
**What**: `Lightbox()` accesses `archiveProp[index]` without checking the item exists.
**Why**: Edge case — crashes on empty archive or out-of-bounds index.
**Fix**: Guard `if (!a) return null`.
**Suggested command**: `/impeccable harden index.tsx`

---

## Persona Red Flags

### Jordan (First-Timer)
- No social proof above the fold — must scroll past metrics into case studies to find evidence of capability
- Bottom dock is cryptic: "Now · Intro · 0% · Search · Sketch · ◐ · BLR 18:30" — 7 items with no labels
- No mobile navigation — if arriving on phone, no indication of what sections exist

### Riley (Stress Tester)
- Anchor links silently fail on missing IDs — `#work`, `#archive` etc. produce no feedback if section is removed
- Lightbox crashes on empty archive — `archiveProp[index]` with no null guard
- Corrupt localStorage silently discarded — malformed JSON falls back to defaults with no error surface

### Casey (Mobile User)
- No way to jump to Work section — nav is desktop-only, must scroll through 2-3 viewports of hero
- Archive "View →" label uses `opacity-0 group-hover:opacity-100` — invisible on touch devices
- Hero metrics grid wraps awkwardly — "1 / very long conversation with craft" is disproportionately long at mobile

---

## Minor Observations

- Footer `padding-bottom: 5rem` hardcoded for all breakpoints — leaves excess space on narrow screens
- Two theme toggles, neither shows current mode — user must toggle and visually check
- Command palette has inconsistent quote style ("straight" vs "curly")
- `useActiveSection` rootMargin of `-40% 0px -50% 0px` means fast skimmers miss section detection

---

## Questions to Consider

1. The tonal-layering system is the signature visual principle, yet the two most prominent UI chrome pieces violate it with shadows. Was this an oversight, or was the tonal system found insufficient for interactive chrome?
2. The eyebrow label is on every section but DESIGN.md explicitly forbids it. Conscious override or implementation drift? If drift, how many other spec violations accumulated the same way?
3. 40 skills in a grid — if the goal is "exhibition, not CV," would a curated selection of 12-15 tags with a "full practice" link serve the narrative better?
