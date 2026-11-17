# Craft floor

These are the minimum standards. Meeting them does not make a design distinctive, but missing them makes any design look cheap. Values are starting points; the direction decides the final numbers.

## Type

- **Families**: one or two. Two only when they contrast in kind (serif + sans, mono + sans), not two similar sans.
- **Scale**: pick a ratio and derive every size. Quiet UI: 1.125 to 1.2 (e.g. 12, 14, 16, 18, 20, 24). Expressive: 1.25 to 1.5, with a display size at least 3× the body. Fluid display sizes with `clamp()`.
- **Body**: 16px minimum on the web (17 to 18 for reading pages). Line height 1.4 to 1.6 for body, 1.0 to 1.2 for display. Measure 45 to 75ch.
- **Weight**: use contrast. 400 with 600/700, or a light display with a bold label. Avoid 500 against 600.
- **Numbers**: `font-variant-numeric: tabular-nums` for anything compared in columns. Right-align numbers in tables.
- **Details**: `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs. Real quotes (“ ”) and apostrophes (’). Tighten tracking slightly on large display text; add tracking only to small caps.
- **Loading**: self-host or preload, `font-display: swap`, subset, at most 3 to 4 files. Set a metric-matched fallback stack.

## Color

- Write tokens in **OKLCH** so lightness is predictable: `oklch(L C H)`.
- **Neutrals are tinted**: give grays a hue (often the accent's) at chroma 0.005 to 0.02. Pure gray looks unconsidered.
- **Roles, not swatches**: ground, surface, ink, muted ink, line, accent, accent-ink, plus semantic success/warning/danger. Each role has a light and dark value.
- **One accent**, used for the primary action and the "now". If everything is accented, nothing is.
- **Contrast**: body text 4.5:1, large text and UI parts 3:1. Check muted text and placeholder text; they fail most often.
- **Dark mode is not inversion**: raise surfaces by lightness (not shadow), lower chroma of the accent, avoid pure black grounds, keep text below pure white.

## Space and shape

- 4px base. Scale like 4, 8, 12, 16, 24, 32, 48, 64, 96. Space encodes relation: close inside a group, far between groups.
- **One radius system**: e.g. 0 / 4 / 8, or all 2px, or all square. Nested radius = outer radius minus padding.
- **One elevation system**: borders for structure, shadows only for things that float (menus, dialogs). Shadows from one light direction, low opacity, neutral tint.
- Lines are information: rules separate things that differ. Do not border every row and every card.

## Layout

- Decide the grid and a strong left edge. Asymmetry is fine if it is consistent.
- Content width from the measure, not from `max-w-7xl` by habit.
- Every section answers a question the user has, in the order they have it. Cut sections that do not.
- Vary section structure where content varies. Do not repeat the same block shape down the page.
- Full-height sections use `100dvh`. Test 375px, 768px, 1280px, 1920px.

## Motion

- Motion explains change: where something came from, what responded, what is loading.
- Durations: 100 to 200ms for UI feedback, 200 to 400ms for entrances and panels, longer only for one deliberate moment.
- Easing: ease-out for entrances (`cubic-bezier(0.2, 0, 0, 1)`), ease-in for exits, no bounce. Springs: well-damped.
- Animate `transform` and `opacity`, list the properties in `transition`.
- One orchestrated moment beats scattered effects. Scroll-triggered fade-ups on every section are noise.
- Always: `@media (prefers-reduced-motion: reduce)` removes non-essential motion.

## States

Every interactive element has: default, hover (pointer only), focus-visible, active, disabled. Every data view has: loading (skeleton matching the real layout), empty (says what to do next), error (says what happened and how to fix it), partial, and overflow (long names, 0 items, 10,000 items).

## Copy

- Say what it does, for whom. Specific nouns, active verbs, short sentences.
- Buttons name the outcome ("Send invoice"), not the mechanism ("Submit").
- Keep terms consistent across a flow. One name per thing.
- Errors: what happened, why, how to fix. No blame, no "Oops!".
- No em dashes, no stock verbs (see W2), no triplet slogans, no exclamation marks in UI.

## Accessibility

Semantic HTML first (`button`, `a`, `label`, `nav`, `main`, headings in order). Visible focus. 24px minimum targets (44px on touch). Never color alone for meaning. Alt text. Zoom allowed. Respect reduced motion and `prefers-color-scheme` when you ship both themes.

## Quiet register (apps, dashboards, tools)

The generic app look is decoration on top of data: gradient headers, stat cards with icons, rounded cards around every chart, an illustration on every empty state. The fix is usually subtraction.

- Density is a feature. Users of tools want more on screen, well aligned, not more whitespace.
- The data is the design. Tables with clear alignment, tabular figures, sticky headers and sensible truncation beat card grids.
- KPIs: number, label, change, and a comparison period. No icon tile. No count-up.
- Charts: direct labels instead of legends, muted gridlines, one highlighted series, honest axes starting at zero for bars.
- Navigation: stable, predictable, keyboard reachable. Command palette if the tool is deep.
- Color is mostly neutral; the accent marks selection and the primary action; semantic colors mark state only.
