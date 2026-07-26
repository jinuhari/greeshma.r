---
name: "Greeshma R. — A Digital Exhibition"
description: "Portfolio and exhibition site for a product designer, visual designer, and illustrator"
colors:
  background: "oklch(0.982 0.006 85)"
  foreground: "oklch(0.185 0.005 60)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.185 0.005 60)"
  popover: "oklch(0.982 0.006 85)"
  popover-foreground: "oklch(0.185 0.005 60)"
  primary: "oklch(0.185 0.005 60)"
  primary-foreground: "oklch(0.982 0.006 85)"
  secondary: "oklch(0.952 0.006 85)"
  secondary-foreground: "oklch(0.185 0.005 60)"
  muted: "oklch(0.952 0.006 85)"
  muted-foreground: "oklch(0.48 0.008 60)"
  accent: "oklch(0.62 0.14 45)"
  accent-foreground: "oklch(0.982 0.006 85)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-foreground: "oklch(0.982 0.006 85)"
  border: "oklch(0.88 0.006 60)"
  ring: "oklch(0.62 0.14 45)"
  terracotta: "oklch(0.62 0.14 45)"
  forest: "oklch(0.42 0.07 155)"
  indigo: "oklch(0.48 0.11 265)"
  coral: "oklch(0.72 0.15 30)"
  ochre: "oklch(0.72 0.14 80)"
  rose: "oklch(0.79 0.06 30)"
typography:
  display:
    fontFamily: "Fraunces, Cormorant Garamond, ui-serif, Georgia, serif"
    fontSize: "clamp(3rem, 13vw, 8rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.035em
  headline:
    fontFamily: "Fraunces, Cormorant Garamond, ui-serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.02em
  title:
    fontFamily: "Fraunces, Cormorant Garamond, ui-serif, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.02em
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.7rem"
    letterSpacing: "0.2em"
    textTransform: uppercase
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
  xl: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    padding: "1.75rem 1.75rem"
  button-ghost:
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
---

# Design System: Greeshma R. — A Digital Exhibition

## 1. Overview

**Creative North Star: "The Exhibition Space"**

Every project on this site is a standalone exhibit with its own atmosphere — a distinct tonal palette, a narrative arc, a defined viewer path. The site itself is the gallery: warm, quiet, letting the work speak. The viewer moves through rooms (sections), pauses at exhibits (case studies), and wanders into the archive. Nothing competes with the work because the gallery is designed to recede.

The system is editorial rather than app-like — generous white space, a serif-driven typographic scale, and tonal layering in place of shadows. Motion is restrained and purposeful: scroll-driven reveals use an exponential ease-out curve, and the only continuous animation (the marquee) is a deliberate exhibition-wall device.

**What this system explicitly rejects:** the Dribbble/Behance portfolio cliché (identical card grids, gradient overlays, browseable shots without context) and the corporate/SaaS template (blue-gray palettes, stock photography, generic hero metrics).

**Key Characteristics:**
- Editorial serif scale with negative letter-spacing at display sizes
- Tonal surface layering (ivory → warm-gray → white) for depth; zero box-shadows
- One anchor accent (terracotta) applied to ≤5% of any given surface
- Per-case-study tonal atmospheres drawn from the artistic palette (forest, coral, indigo)
- Reveal animations driven by a single exponential ease-out curve
- Custom cursor on desktop as a gallery-attendant gesture

## 2. Colors

The palette is warm-neutral with a single terracotta anchor accent and an artistic secondary set reserved exclusively for case study atmospheres. Light mode uses an ivory base; dark mode inverts to near-black with the same accent.

### Primary

- **Ink** (`oklch(0.185 0.005 60)`): All body text, primary button backgrounds, navigation links. The only text color used at scale.
- **Ivory** (`oklch(0.982 0.006 85)`): Default page background, popover surfaces. The gallery wall.
- **Warm-Gray** (`oklch(0.952 0.006 85)`): Section alternation background (Archive, Skills sections). The gallery's secondary room tone.
- **White** (`oklch(1 0 0)`): Card backgrounds, elevated surfaces.

### Accent

- **Terracotta** (`oklch(0.62 0.14 45)`): The sole accent. Used for link hover states, the accent underline, selection highlight, timeline dots, the hero emphasis word, and the decorative asterisk in the marquee. Prohibited from large background areas, decorative gradients, or decorative borders.

### Artistic Palette (Case Study Atmospheres)

- **Forest** (`oklch(0.42 0.07 155)`): The "Qualin" case study — muted green for a wellness brand identity.
- **Coral** (`oklch(0.72 0.15 30)`): The "Tomodachi" case study — soft warm pink for a language learning app.
- **Indigo** (`oklch(0.48 0.11 265)`): The "Weaving Voices" research case study — muted blue for academic/fieldwork depth.
- **Ochre** (`oklch(0.72 0.14 80)`): Available for future case studies needing a warm gold accent.

These appear only as tinted section backgrounds (`/10` opacity) and badge borders within their respective case study pages. Never reused outside case study context.

### Semantic Roles

- **Foreground** `oklch(0.185 0.005 60)`: Body text on all light surfaces.
- **Muted Foreground** `oklch(0.48 0.008 60)`: Eyebrow labels, secondary metadata, footer text. Checked at 4.5:1 against ivory background.
- **Border / Input** `oklch(0.88 0.006 60)`: Hairline dividers, input strokes, timeline connecting lines.
- **Destructive** `oklch(0.577 0.245 27.325)`: Error states, destructive actions (used in shadcn components, rarely visible in the portfolio).

### The Tonal Atmosphere Rule

Each case study gets exactly one atmospheric treatment: the section background gets a `/10` tint of its assigned tone, and badges carry the tone at `/15` fill with the full-tone border. No mixing, no blending, no gradient transitions between atmospheres.

## 3. Typography

**Display Font:** Fraunces (optical size 9–144, weights 300/400/500) with Cormorant Garamond fallback
**Body Font:** Inter (weights 300/400/500/600)
**Label/Mono Font:** JetBrains Mono (weights 400/500)

**Character:** A disciplined serif-and-sans pairing where the serif carries all the personality. Fraunces is warm and softly modulated without being decorative — its ink traps and graded optical sizes give it a textured, almost letterpress feel at display sizes. Inter provides a clean, neutral counterpoint for readable body copy.

### Hierarchy

- **Display** (Fraunces 400, `clamp(3rem, 13vw, 8rem)`, 0.95 line-height, -0.035em letter-spacing): Hero headings only. The largest type in the system. Uses `text-wrap: balance`.
- **Headline** (Fraunces 400, `clamp(2.25rem, 5vw, 4.5rem)`, 0.95 line-height, -0.02em letter-spacing): Section headings (Selected Work, Archive, Experience, About, Contact). `text-wrap: balance`.
- **Title** (Fraunces 400, `clamp(1.5rem, 3vw, 1.875rem)`, 1.1 line-height, -0.02em letter-spacing): Case study titles, timeline event titles, archive item labels.
- **Body** (Inter 400, `1rem` / `0.875rem`, 1.6 line-height): All paragraph text. Max line length 65–75ch. The homepage body uses `text-muted-foreground`; case study body uses `text-muted-foreground` for descriptive text and `text-foreground` for key narrative sentences.
- **Label / Eyebrow** (JetBrains Mono 400, `0.7rem`, 0.2em letter-spacing, uppercase): Section kickers, numbered indices, metadata labels, filter buttons. Never used for body copy.

### The No-Inexpressive-Scaling Rule

Clamp scales are tuned per breakpoint so no line overflows its container. The display size `13vw` at hero is capped at `8rem` (128px) so it never exceeds the viewport width on tablet or desktop.

## 4. Elevation

The system uses **tonal layering exclusively** — no box-shadows, no drop-shadows, no elevation tokens. Depth is conveyed entirely through surface tone alternation:

- **Base** (ivory `oklch(0.982 0.006 85)`): Default page background.
- **Alternate** (warm-gray `oklch(0.952 0.006 85)`): Archive and Skills sections create visual rhythm by breaking from the base.
- **Elevated** (white `oklch(1 0 0)`): Card surfaces, popovers, and lightbox content sit on white to distinguish them from the gallery wall.
- **Backdrop** (ivory at 95% opacity + backdrop-blur): The lightbox overlay and the sticky nav background use blur to separate chrome from content.

### The Flat-By-Default Rule

Surfaces are flat at rest. What reads as "elevation" is always a tone shift, never a shadow. The scrolling nav gets a hairline bottom border (`border-border/50`) plus blur, not a drop-shadow.

## 5. Components

### Buttons

- **Shape:** Fully rounded (9999px / `rounded-full` for hero CTA); standard radius (6px / `rounded-md`) for shadcn action buttons.
- **Primary CTA ("View Selected Work"):** Foreground background, ivory text, full rounded pill shape, 28px vertical padding, with a hover transition to terracotta background. Accompanied by an arrow that shifts +1px right on hover.
- **Text Link ("Download Résumé", "Read the case study"):** No background. An underline border on the bottom (`border-b`) that shifts to terracotta on hover. Text shifts to terracotta on hover.
- **Ghost (shadcn default):** No background at rest, terracotta background + white text on hover. Used in admin/settings surfaces.
- **Filter pills (Archive):** Rounded-full pills with border. Active state: foreground background + ivory text. Inactive: border-border, ivory text.

### Navigation

- **Desktop:** Horizontal link bar, center-aligned. Links have a `tracking-wide` label treatment and an animated underline (`w-0 → w-full` on hover) using the terracotta accent. The nav gains a blur + hairline border on scroll.
- **Mobile:** Hidden by default. The logo and Theme toggle remain visible. The site is single-page with anchor links; no hamburger menu is used.
- **Case study nav:** A slim fixed header with Back arrow (left) and title + number index (right). Always has the blur + hairline treatment.
- **Footer:** Caption text with year and location. No primary navigation here.

### Case Study

Each case study is a two-column hero (image + metadata) followed by free-form narrative sections. This is the signature component — not a card, not a grid, but a narrative document.

- **Hero:** Tonal background tint matching the case study's atmosphere. Left column: eyebrow + title + role + summary + badges. Right column: featured image in a hover-zoom container.
- **Content sections:** Four possible types — `text` (centered prose, max-w-3xl), `image` (single or multi-image figures), `image-text` (two-column with optional image position), `full-bleed` (edge-to-edge image).
- **Footer:** Previous/Next case study navigation with title and kicker.

### Cards / Containers

- **Corner style:** Rounded-xl (10px / `rounded-xl`).
- **Background:** White (`bg-card` = `oklch(1 0 0)`).
- **Shadow strategy:** None (see Elevation).
- **Border:** Hairline (`border-border` = `oklch(0.88 0.006 60)`).
- **Internal padding:** 24px (`p-6`).
- Cards appear only for the shadcn component library (e.g., admin surfaces, settings). The portfolio itself does not use cards — case studies are articles, not cards.

### Inputs / Fields

- **Style:** Border stroke (`border-input`), transparent background, 6px radius (`rounded-md`).
- **Focus:** Ring at `--ring` color (terracotta `oklch(0.62 0.14 45)`), subtle glow.
- **Placeholder:** Muted-foreground at 4.5:1 contrast — not the default muted-gray.
- **Disabled:** 50% opacity, no pointer events.

### Chips / Tags

- **Style:** Rounded-full, transparent background at rest, border border. Hover shifts to terracotta text + border.
- **Variants:** Atmosphere-tinted for case study badges (terracotta/forest/coral/indigo at `/15` fill);
- **Context:** Archive filter pills, case study metadata badges, skill tags, tools list.

### Lightbox

- **Trigger:** Click on any archive item.
- **Container:** Fixed fullscreen overlay with ivory 95% + backdrop-blur.
- **Content:** Image at max 85vh, centered, with caption badge and medium below.
- **Navigation:** Previous/Next arrows at viewport edges. Keyboard: Escape closes, Arrow keys navigate.
- **Transition:** Instant fade-in via backdrop-blur, no layout animation.

### Hover Zoom

- **Pattern:** Image containers in case studies and the About portrait use the `.hover-zoom` utility. On hover, the image scales to 1.04× over 1.6s with an exponential ease-out curve.
- **Scope:** Case study hero images, About portrait, archive thumbnails.

## 6. Do's and Don'ts

### Do

- **Do** use the serif display scale for every heading. No heading should be set in Inter.
- **Do** use terracotta as the single accent across all interactive elements — link hovers, underline animations, focus rings, selection highlight.
- **Do** alternate background tones (ivory → warm-gray → ivory) to create section rhythm.
- **Do** scope the artistic palette (forest, coral, indigo, ochre, rose) exclusively to case study atmospheres.
- **Do** use the monospace eyebrow label for section kickers, numbered indices, and metadata — never for body copy or headings.
- **Do** use the exponential ease-out curve (`cubic-bezier(0.22, 1, 0.36, 1)`) for all reveal animations and decorative transitions.
- **Do** test every heading at every breakpoint for overflow.

### Don't

- **Don't** use box-shadows or drop-shadows anywhere. Use tonal layering (ivory → warm-gray → white) for depth.
- **Don't** use gradient text (`background-clip: text`). Emphasis comes from weight, size, or terracotta color.
- **Don't** use glassmorphism or backdrop-blur decoratively. The blur is reserved for the nav and lightbox overlay.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding. The case study numbering (01 / 04) is justified by sequence; section headings on the homepage are not numbered.
- **Don't** use the tiny uppercase tracked eyebrow above every section. The eyebrow is a label, not a section template.
- **Don't** use identical card grids (icon + heading + text) repeated across sections. Each section has its own layout structure.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe.
- **Don't** use the Dribbble/Behance portfolio template: browsable shot grids without narrative, gradient overlays, or glass cards.
- **Don't** use the corporate/SaaS template: blue-gray palettes, stock photography, or generic hero metrics.
