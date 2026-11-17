# Tells catalog

Each tell is a choice that appears because it is the most likely output, not because the subject asked for it. IDs match `scripts/scan.mjs`. **scan** means the scanner detects it in code; **look** means you have to render or read the page.

A tell is a smell, not a crime. Any of these can be right with a specific "because". None of them can be right by reflex.

Severity: **P0** a layperson notices · **P1** a designer or developer notices · **P2** craft, or a second-order default.

## C · Color

| ID | Sev | Tell | Why it reads as default | Fix | |
|---|---|---|---|---|---|
| C1 | P0 | Indigo/purple/violet gradient, usually to blue or pink | Tailwind's indigo-500 plus a million "AI startup" heroes. The single loudest tell. | Derive hues from the subject's world. Gradients only for something physical: light, depth, a data scale. | scan |
| C2 | P1 | Gradient-filled headline text | Template move that also hurts legibility and contrast. | One solid ink. Emphasis through size, weight, face. | scan |
| C3 | P1 | Colored neon glow (`shadow-indigo-500/50`, `0 0 40px` cyan) | Light does not glow purple around a button. | Neutral, low shadow tied to one light source, or a border. | scan |
| C4 | P1 | `indigo-600` as the brand color | The framework default, not a brand. | Own accent token, chosen from the world. | scan |
| C5 | P2 | Untouched shadcn/ui tokens | Every shadcn app looks like every other one. | Re-derive background, primary, muted, radius from your direction. | scan |
| C6 | P1 | Evenly spread rainbow palette (blue, green, orange, pink cards) | No color is in charge, so none means anything. | One dominant ground, one ink, one accent; semantic colors only for state. | look |
| C7 | P1 | Gray text on a colored background | Gray is a lightness, not a hue: it goes muddy on color. | Tint the muted text from the background hue. | look |
| C8 | P1 | Muted text under 4.5:1 | "Subtle" gray that fails WCAG AA. | Check contrast. Muted ≠ illegible. | look |
| C9 | P2 | Pure `#000` on pure `#fff` or the reverse, big areas | Harsh, and a sign nobody tuned the neutrals. | Tinted neutrals (a few degrees toward the accent hue, low chroma). | look |

## T · Type

| ID | Sev | Tell | Why | Fix | |
|---|---|---|---|---|---|
| T1 | P1 | Inter, Roboto, Arial, Open Sans, Lato, Poppins, Montserrat as the voice | The most-installed fonts are the most-sampled. "Nobody chose a typeface." | Pick a face for a reason from the world. A neutral sans is fine for quiet UI if you say why, and give the display level a voice. | scan |
| T2 | P1 | Font named in CSS but never loaded | Page renders in the fallback; the "choice" never shipped. | Load it, or remove it. | scan |
| T3 | P1 | One weight and one size jump (bold 48px over regular 18px) | No hierarchy beyond "big" and "small". | A real scale (see craft.md), contrast in weight, case, face and space. | look |
| T4 | P2 | Body text over 80 characters a line, or centered paragraphs | Reading comfort ignored. | 45 to 75ch measure. Center only short lines. | look |
| T5 | P2 | Headline in Title Case With Every Word Capitalized | Feels like a template heading. | Sentence case, unless the world uses title case (books, film). | look |

## L · Layout

| ID | Sev | Tell | Why | Fix | |
|---|---|---|---|---|---|
| L1 | P1 | Pill badge above the hero headline ("✨ New: AI features") | Every landing page since 2021. | Delete, or make it real information in the page's own type. | scan |
| L2 | P2 | Three equal cards in a row | Content is rarely three equal things. | Lead item plus supports, list, table, sequence, comparison. | scan |
| L3 | P2 | `100vh` / `h-screen` | Crops on mobile browsers. | `100dvh` / `min-h-dvh`. | scan |
| L4 | P0 | Stock section order: hero, logo strip, 3 features, stats, testimonials, pricing, CTA band, 4-column footer | The silhouette of ten thousand sites. | Order sections by the user's questions. Cut what this page does not need. | look |
| L5 | P1 | Centered everything | Centered text is a ceremony; using it for everything removes the axis. | Pick a strong left edge or grid; center only on purpose. | look |
| L6 | P1 | Cards in cards | Boxing for its own sake. | Use space and rules to group. One level of container. | look |
| L7 | P1 | Three-tier pricing with the middle one ringed "Most popular" | Template. | Show the real decision the buyer makes. Sometimes it is one price. | look |
| L8 | P2 | Same padding on every section | No rhythm; nothing is closer or further. | Space encodes relation: tighter inside a group, wider between. | look |
| L9 | P1 | Hero with a dashboard mockup floating at an angle with a glow | Stock product shot. | Show the real product at real size doing the one job, or a real artifact. | look |

## K · Components

| ID | Sev | Tell | Why | Fix | |
|---|---|---|---|---|---|
| K1 | P1 | `rounded-2xl shadow-lg` on everything | The SaaS card kit. | One radius scale, one elevation scale. Most things need a border or nothing. | scan |
| K2 | P1 | Glassmorphism as decoration | `backdrop-blur` over a flat background blurs nothing. | Only where content scrolls behind. | scan |
| K3 | P1 | Icon in a tinted rounded square above each heading | Fills a slot, says nothing. | Drop it, or show something specific (a number, a real thumbnail). | scan |
| K4 | P2 | Fake window dots on a "screenshot" | Decoration pretending to be product. | Real screenshot or none. | scan |
| K5 | P1 | Aceternity/Magic UI stock effects (beams, spotlight, marquee, bento glow, meteors) | Recognized on sight. | Effects must come from the subject or not exist. | look |
| K6 | P1 | Buttons all the same weight | No primary action. | One primary per view; secondaries quieter. | look |
| K7 | P1 | Missing states (hover, focus, active, disabled, loading, empty, error) | Only the happy path was designed. | Design every state; see craft.md. | look |

## M · Motion

| ID | Sev | Tell | Why | Fix | |
|---|---|---|---|---|---|
| M1 | P1 | Animation with no reduced-motion path | Ignores users who get sick from motion. | `prefers-reduced-motion`, `motion-safe:`, `useReducedMotion()`. | scan |
| M2 | P2 | Bounce easing | Reads as toy. | Firm ease-out or a damped spring. | scan |
| M3 | P2 | Hover lift/scale on every card | Everything jumps, nothing is clickable-looking. | Feedback only on interactive things, smaller than a jump. | scan |
| M4 | P2 | Count-up numbers | Delay with no information. | Show the number. | scan |
| M5 | P2 | `transition: all` | Animates layout and color by accident. | List properties. | scan |
| M6 | P1 | Same fade-up on every section as you scroll | One effect, applied everywhere, means nothing. | One orchestrated moment (often the first load) or none. | look |

## W · Words

| ID | Sev | Tell | Why | Fix | |
|---|---|---|---|---|---|
| W1 | P1 | Em dashes in UI copy | The most reliable machine-copy tell. | Period, comma, colon, parentheses. | scan |
| W2 | P1 | Elevate, seamless, supercharge, unleash, unlock the power, empower, effortless, cutting-edge, next-gen, world-class, all-in-one, lightning-fast | Fits every product, so says nothing. | What it does, for whom, in the user's words. | scan |
| W3 | P2 | "Get started", "Learn more" with an arrow | Generic. | Name the outcome: "Import your CSV". | scan |
| W4 | P0 | John Doe, Acme, lorem ipsum, pravatar avatars | Nothing was decided. | Plausible specific content. | scan |
| W5 | P2 | 10,000+ teams, 99.9% uptime, 10x faster | Sounds invented. | Real number and source, or none. | scan |
| W6 | P1 | Headline as two short slogans ("Build faster. Ship smarter.") | Weightless; could be anyone. | A sentence only this product could say. | look |
| W7 | P2 | Triplets everywhere ("Fast, secure, and scalable") | Rhythm of filler. | One concrete claim with a detail. | look |

## I · Icons and imagery

| ID | Sev | Tell | Why | Fix | |
|---|---|---|---|---|---|
| I1 | P1 | Sparkle icon for AI | Means nothing specific. | Name the action. | scan |
| I2 | P1 | Emoji as icons | Platform-dependent, reads as filler. | Real icons, sparingly, or type only. | scan |
| I3 | P2 | Lucide at default size and stroke on every item | The house set of every generated app. | Fewer icons. If you keep a set, tune size and stroke to the type. | look |
| I4 | P1 | Abstract 3D blobs, gradient orbs, isometric illustrations | Stock decoration. | Photography, diagrams or artifacts of the actual subject. | look |

## S · Second-order defaults

What models moved to once the first-order tells got banned. They look "designed", which is why they slip through. Each needs a specific "because".

| ID | Sev | Tell | When it is actually right | |
|---|---|---|---|---|
| S1 | P2 | Space Grotesk, Geist, Instrument Serif, Fraunces, Playfair, Plus Jakarta, DM Sans, Manrope, Outfit, Sora, Bricolage | When the face's origin or form matches the subject, and you can say how. | scan |
| S2 | P2 | Cream ground with terracotta accent | Pottery, paper, print, food made of clay and fire. | scan |
| S3 | P2 | Near-black with one acid-green or vermilion signal | Terminals, oscilloscopes, things that literally glow. | scan |
| S4 | P2 | Tracked uppercase mono "eyebrow" labels on every section | When they label real data (a field name, a coordinate). | scan |
| S5 | P2 | Decorative `01 / 02 / 03` numbering | When order matters to the reader. | scan |
| S6 | P2 | One word in the H1 in a different color or italic serif | Almost never; let the line work. | scan |
| S7 | P2 | "Design · Build · Ship" dot-separated meta strings | Real metadata (date · author · read time). | scan |
| S8 | P1 | Broadsheet cosplay: hairlines, column rules, masthead, tiny caps, on a non-editorial product | When the product is journalism. | look |
| S9 | P1 | Bento grid of mixed-size rounded tiles | When the content really has mixed weights. | look |
| S10 | P2 | Grain/noise overlay on every ground | When the subject is film, print, paper. | look |

## A · Accessibility floor

Not a style question. Always fix.

| ID | Sev | Tell | Fix | |
|---|---|---|---|---|
| A1 | P1 | `outline: none` with no focus style | `:focus-visible` ring, 2px, 3:1 contrast. | scan |
| A2 | P1 | Zoom disabled in viewport meta | Remove `maximum-scale` / `user-scalable=no`. | scan |
| A3 | P1 | `<img>` without `alt` | Describe it, or `alt=""` for decoration. | scan |
| A4 | P1 | Click targets under 24px, or under 44px on touch | Pad the hit area. | look |
| A5 | P1 | Color as the only signal (red/green status) | Add text, icon or shape. | look |
| A6 | P1 | Divs as buttons, missing labels on inputs | Native elements, `<label>`. | look |
