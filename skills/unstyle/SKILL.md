---
name: unstyle
description: Removes the generic "AI made this" look from frontend work and keeps it from coming back. Use when building or restyling any web UI (landing page, app screen, dashboard, component, email, artifact), when the user says a design looks generic, templated, like AI slop, like every other SaaS site, or asks to unslop, audit, critique or redesign a UI. Grounds the design in the subject, checks every choice against the model's defaults (including the newer "tasteful" ones), and runs a zero-dependency scanner for code-level tells.
license: ISC
---

# unstyle

A model left alone picks the most likely design: Inter, an indigo-to-purple gradient, a centered hero with a pill badge, three icon cards, `rounded-2xl shadow-lg`, "Elevate your workflow". That is not a style. It is what you get when nobody decided anything.

Banning those picks does not fix it. It moves the default. Ban Inter and the model picks Space Grotesk. Ban purple and you get cream with terracotta, or near-black with one acid-green accent, tracked mono labels and `01 / 02 / 03`. Those are slop too, one level up.

So this skill does not hand out a style. It makes every choice come **from the subject**, then checks it against what the model would pick anyway.

## The one test

For every design decision, finish this sentence: **"I chose X because this \_\_\_ ..."** where the blank is something specific about *this* product, its users or its world.

If the reason would work for any product in the category ("because it feels modern", "because it is clean", "because SaaS sites do this"), the choice is a default. Replace it.

## Modes

Pick from the request:

- **build**: new UI. Run steps 1 to 6.
- **unslop**: existing UI looks generic. Scan first, then steps 1 to 6, changing look and copy but keeping behavior, data flow, props, routes and accessibility.
- **audit**: "just review", "don't change code". Scan, render if you can, report findings by severity with fixes. Change nothing.

## 0. Read the room

Before any design move, look for decisions already made: `DESIGN.md`, design tokens, a Tailwind theme, a component library, brand assets, sibling pages. If they exist, **work inside them.** Unslopping an established system means using it well (its type, its spacing, its voice), not replacing it with your taste.

If the UI is already distinctive and coherent, say so and stop. Do not restyle good work to show effort.

## 1. Ground it in the subject

Write down, briefly:

- **Who and what**: the product, the user, the one job this screen does.
- **The world**: 5 to 8 concrete nouns from the subject's own world. Materials, tools, places, documents, sounds, jargon. Not "innovation" or "speed".
- **The native artifact**: what this domain already made before the web. A tide table, a lab notebook, a ship's log, a vinyl sleeve, a ledger, a menu board, a trail map, a dispatch form. This is your best source of layout, type and color, because it already solved how this information wants to look.
- **Register**: *expressive* (marketing, editorial, portfolio: needs a point of view) or *quiet* (app, dashboard, tool: needs clarity and density; here slop is decoration, and the fix is usually *less*).

If you cannot name the subject, ask one question. Do not guess a generic product.

## 2. Write a direction (6 lines)

```
Palette:   4–6 colors with roles (ink, ground, surface, accent, signal), in OKLCH, each traced to the world
Type:      display face + text face (or one family), each with a "because"
Skeleton:  one sentence describing the layout idea, taken from the native artifact
Signature: one detail only this product would have
Motion:    one moment, or none. Say what it communicates
Voice:     3 words for the copy, plus 2 words it will never use
```

Keep it in the reply or in `DESIGN.md` when the work spans pages (template in `references/design-md.md`).

## 3. Attack the direction before you build

Go line by line:

1. Apply **the one test** to each line.
2. Check each line against `references/tells.md`, including section S (the second-order defaults). If a line matches, it needs an unusually strong "because" or it goes.
3. Ask: **if I wrote this brief for a competitor, would it change?** If not, it is not specific yet.
4. For multi-page or large rewrites in unslop mode, show the direction and wait for a yes.

## 4. Build

- **Tokens first.** CSS custom properties for color, type scale, space, radius, shadow, easing. Then structure. Then content. Every value in the page comes from a token.
- **Real content.** Real product names, real-looking data with realistic variance (not 10,000+, 99.9%, "John Doe", "Acme"). Write the copy for the user's actual job. Short sentences. No em dashes.
- **Structure means something.** Borders, rules, numbering and color encode information or they are removed. One radius system, one elevation system, one accent.
- **Hierarchy from contrast in kind**, not just size: weight, case, face, space, position.
- Follow the craft floor in `references/craft.md` (type scale, OKLCH palettes, spacing, motion, states, a11y). It is the minimum, not the design.

## 5. Verify

Run the scanner on what you touched. `scripts/scan.mjs` sits in this skill's base directory; use its absolute path, or `npx -y @m0xoo/unstyle` if you cannot find it:

```bash
node <skill-dir>/scripts/scan.mjs <files-or-dirs>       # exit 2 if any P0/P1
node <skill-dir>/scripts/scan.mjs src --min=P1 --json   # CI / machine use
```

Fix every P0 and P1. For P2s and second-order hits, either fix them or keep them with a written "because". Intentional choices get an ignore comment (`unstyle-ignore: S2` on the line, `unstyle-ignore-file: S1` for the file). M1 (reduced motion) is judged per file: if the guard lives in a global stylesheet, mark the component with `unstyle-ignore-file: M1`.

The scanner only sees code. If you can render (browser tool, Playwright, screenshot), look at the page and run these:

- **Silhouette**: blur or squint until you only see blocks. Does the shape look like every landing page (centered hero, logo row, 3 cards, testimonial, CTA band, 4-column footer)? Change the skeleton.
- **Swap**: put a competitor's name on it. Still works? It is not about this product yet.
- **Squint for one thing**: one element should win. If everything shouts, nothing does.
- **Phone width** (375px) and **keyboard tab** through every control.

## 6. Report

Briefly list the direction, the main choices with their "because", what the scanner found and fixed, and anything kept on purpose. In audit mode, give findings as `ID · severity · location · why · fix`.

## Severity

- **P0**: a layperson would notice ("this looks AI-made"). Purple gradients, placeholder people, fake content.
- **P1**: a designer or developer would notice. Default fonts, the card kit, gradient text, stock copy, missing focus and reduced-motion.
- **P2**: craft and second-order defaults. Fine when justified, slop when reflexive.

## References

- `references/tells.md`: the full catalog with IDs, why each reads as default, and the fix. Read it in step 3 and for audits.
- `references/grounding.md`: worked examples of subject → direction, and how to find the native artifact.
- `references/craft.md`: the quality floor for type, color, space, layout, motion, states, copy and accessibility, plus quiet-register (app and dashboard) rules.
- `references/design-md.md`: a `DESIGN.md` template so multi-page work does not drift back to defaults.

## Do not

- Do not pick a "theme" from a list and apply it. Themes are just more defaults.
- Do not swap one tell for its second-order version (Inter → Space Grotesk, purple → terracotta) and call it done.
- Do not add decoration to look designed. Removing things is often the fix.
- Do not claim a tell proves AI authorship. It shows a choice nobody made.
