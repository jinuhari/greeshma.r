# Code Smell Report — Greeshma R. Portfolio

Generated: 2026-07-18  
Scope: Full project (`src/`)

---

## 1. God Objects (Files Doing Too Much)

### `src/routes/index.tsx` (622 lines — 14 components)
- **Smell:** Single file hosts 14 components: `Home`, `Nav`, `Hero`, `Marquee`, `SelectedWork`, `Archive`, `Lightbox`, `Timeline`, `Skills`, `About`, `Contact`, `Footer`, plus inline route definition.
- **Risk:** The `Home` component alone manages 6 `useState` + 3 `useEffect` hooks for CMS state, scroll, lightbox, and cursor control. The `SelectedWork` component duplicates outcome rendering and case study linking that also lives in `work.$slug.tsx`.
- **Recommendation:** Extract `Archive`, `Lightbox`, `Timeline`, `Skills`, `About`, `Contact`, `Footer`, and `Marquee` into their own component files under `src/components/sections/`.

### `src/components/app/app-shell.tsx` (619 lines — 8 components)
- **Smell:** `AppShell` composes 6 sub-shell components (`ScrollProgressBar`, `Cursor`, `SectionDots`, `StatusBar`, `CommandPalette`, `SketchOverlay`) that are tightly coupled and never used independently.
- **Risk:** `CommandPalette` at 186 lines is its own god-object-within-a-god-object, mixing query state, keyboard navigation, rendering, and business logic (sections, theme, sketch, links) all in one function.
- **Recommendation:** Split `CommandPalette` into `src/components/app/command-palette.tsx`. Extract `SketchOverlay` into its own file. Consider extracting `StatusBar` separately.

### `src/components/app/cms-panel.tsx` (774 lines — 14 components)
- **Smell:** 14 sub-components (`Header`, `ListPanel`, `EditorPanel`, `ImageUpload`, `WorkEditor`, `Field`, `TextArea`, `SectionList`, `SectionImageRow`, `ToolsEditor`, `OutcomeList`, `ArchiveEditor`, `TimelineEditor`) crammed into one file.
- **Risk:** `WorkEditor` (84 lines) + `SectionList` (120 lines) alone account for ~200 lines of form logic. The `ListPanel` manages DnD state (`dragIdx`, `overIdx`) inline.
- **Recommendation:** Extract into `src/components/cms/` directory with files: `cms-panel.tsx`, `work-editor.tsx`, `archive-editor.tsx`, `timeline-editor.tsx`, `section-list.tsx`, `image-upload.tsx`, `tools-editor.tsx`, `outcome-list.tsx`.

---

## 2. Shotgun Surgery (One Change Requires Touching Many Files)

### Adding a new field to `CaseStudy`
- If `CaseStudy` in `cms.ts` adds a field, you must update: `cms-panel.tsx::WorkEditor` (form), `cms-panel.tsx::ImageUpload` (if image-related), `index.tsx::SelectedWork` (display), `work.$slug.tsx::CaseStudyHero` or `CaseStudyContent` (display), `cms-panel.tsx::EditorPanel` (save logic).
- **Impact:** 4 files across `lib/`, `routes/`, `components/app/`.

### Changing localStorage key or serialization
- `data.ts` has 6 functions (`loadWorks/saveWorks`, `loadArchive/saveArchive`, `loadTimeline/saveTimeline`) with identical try/catch/fallback patterns. Changing the storage mechanism (e.g., to IndexedDB) means editing all 6 functions plus the imports in `index.tsx` (3 `useState` initialisers + 3 `onSave*` callbacks).

---

## 3. Coupling & Cohesion Issues

### Circular-ish import pattern
- `index.tsx` imports from `cms.ts`, `data.ts`, `cms-panel.tsx`, `app-shell.tsx`, `use-reveal.ts`, and assets.
- `work.$slug.tsx` imports from `cms.ts`, `data.ts`, `app-shell.tsx`, `use-reveal.ts`.
- `app-shell.tsx` imports from `use-reveal.ts` (for `toggleTheme`).
- **Not fully circular**, but `app-shell.tsx` is imported by both routes, while `app-shell.tsx` imports a hook that `index.tsx` also imports directly — tangential coupling.

### `use-reveal.ts` — Cohesion Problem
- File exports 3 unrelated items: `useReveal()` (scroll intersection), `useTheme()` (localStorage theme init), `toggleTheme()` (theme toggle + persistence).
- These are semantically unrelated and only grouped by file convenience.
- **Recommendation:** Split into `use-reveal.ts`, `use-theme.ts`, and move `toggleTheme` into a theme utility.

---

## 4. Data & Logic Duplication

### Outcome rendering duplicated
- `index.tsx::SelectedWork` (lines 298-307) renders outcome metrics for each case study.
- `work.$slug.tsx::CaseStudyContent` (lines 133-142) renders the exact same outcome layout.
- **Impact:** ~15 lines of JSX duplicated.

### `loadX/saveX` pattern duplication
- `data.ts` has 3 identical pairs (`Works`, `Archive`, `Timeline`) with the same try/catch/JSON.parse/Array.isArray pattern. Only the `localStorage` key and type differ.
- **Recommendation:** Create a generic `loadFromStorage<T>(key: string, fallback: T[]): T[]` + `saveToStorage<T>(key: string, data: T[])` helper.

### Image upload logic duplicated
- `ImageUpload` (line 261 in `cms-panel.tsx`) uses `FileReader` → `reader.result` pattern.
- `SectionImageRow` (line 584) uses the identical `FileReader` pattern.
- **Recommendation:** Extract a shared `useFileUpload` hook or a `readFileAsDataURL` utility function.

---

## 5. Type & Safety Concerns

### `any` types in CMS panel
- `ListPanel` uses `item: any` for the list item (line 203).
- `EditorPanel` uses `item: any` and `onSave: (item: any) => void` (line 249).
- `onEdit: (item: any) => void` in `ListPanel` props (line 157).
- **Impact:** TypeScript provides no compile-time guarantee for the editor dispatch. A `works` item passed to `ArchiveEditor` would silently fail at runtime.

### Archive reorder comparison uses object reference
- `cms-panel.tsx` line 72: `archive.filter((a) => a !== editing)` — this works only because `editing` is a reference from the same array. If `editing` is deep-cloned, deletion silently fails.
- Same risk at line 58: `archive.indexOf(editing as ArchiveItem)`.

### Lightbox keyboard nav not unmount-safe
- `index.tsx` line 55-68: `useEffect` returning a cleanup that checks `lightbox`. If `lightbox` changes while the effect's key listener is still registered, the old closure's `setLightbox` may produce stale state.

---

## 6. Performance Concerns

### `loadWorks()` called multiple times per render
- `work.$slug.tsx::CaseStudyPage` calls `loadWorks()` (line 31).
- `CaseStudyNav` calls `loadWorks()` again (line 48).
- `CaseStudyFooter` calls `loadWorks()` again (line 254).
- **Impact:** 3x `JSON.parse` + `localStorage.getItem` per render of a case study page.
- **Recommendation:** Pass `allWorks` as a prop or lift to the route component.

### `ListPanel` re-renders entire list on drag
- Every `dragOver`/`drop` event sets `overIdx` state, triggering a full re-render of the entire list panel.

---

## 7. Structure & Maintainability

### Flat `src/components/app/` — No sub-directories
- `app/` contains semantically diverse files: `app-shell.tsx` (shell), `cms-panel.tsx` (admin). A CMS with 14 sub-components lives in a single file because there's no directory to split into.

### All UI components in `src/components/ui/` — Radix proxied but no barrel exports
- 50+ UI component files with no `index.ts` barrel. Consumers import directly by path: `import { Button } from "@/components/ui/button"`.

### Route tree auto-generated but no type-safe params validation
- `routeTree.gen.ts` is auto-generated by TanStack Router. Route params like `slug` are stringly typed — there's no schema validation for `slug` beyond a `.find()` that returns `undefined`.

---

## Summary Table

| Severity | Count | Examples |
|----------|-------|---------|
| **High** | 5 | God objects in `cms-panel.tsx` (774L), `index.tsx` (622L), `app-shell.tsx` (619L); `any` types in CMS dispatch; `loadWorks()` called 3x per page |
| **Medium** | 4 | Outcome rendering duplicated; image upload logic duplicated; `loadX`/`saveX` pattern duplication; cohesion problem in `use-reveal.ts` |
| **Low** | 3 | Lightbox stale closure; archive reorder uses reference equality; no barrel exports for UI components |
