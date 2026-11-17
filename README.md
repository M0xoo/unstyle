# unstyle

An agent skill that takes the default out of AI-made design.

Left alone, a model picks the most likely design: Inter, an indigo-to-purple gradient, a centered hero with a pill badge, three icon cards, `rounded-2xl shadow-lg`, "Elevate your workflow". Banning those does not fix it. The model just moves to the next default: Space Grotesk, cream and terracotta, tracked mono labels, `01 / 02 / 03`.

unstyle does not give the model a theme. It makes every design choice come from the subject, then checks each choice against what the model would have picked anyway. It also ships a zero-dependency scanner for the tells you can find in code.

**Examples:** https://m0xoo.github.io/unstyle/ (one brief, before and after)

| | Before | After |
|---|---|---|
| Scanner | P0 11 · P1 30 · P2 12 | P0 0 · P1 0 · P2 0 |
| Page | [before.html](examples/before.html) | [after.html](examples/after.html) |

## Install

Any agent that reads [Agent Skills](https://agentskills.io) (Claude Code, Codex, Cursor, Copilot, opencode, and others):

```bash
npx skills add M0xoo/unstyle
```

Claude Code plugin:

```text
/plugin marketplace add M0xoo/unstyle
/plugin install unstyle@unstyle
```

Or copy `skills/unstyle/` into `~/.claude/skills/` (or your project's `.claude/skills/`).

The skill triggers on its own when you build or restyle UI, or when you say a design looks generic. You can also ask for it: "unslop this page", "audit the dashboard with unstyle".

## What the skill does

1. **Reads the room.** Uses the design system the project already has. Stops if the UI is already distinctive.
2. **Grounds it.** Names the subject, its world, and its *native artifact*: what the domain made before software (a tide table, a ledger, a kitchen rota). That artifact gives layout, palette and type.
3. **Writes a six-line direction.** Palette, type, skeleton, signature, motion, voice.
4. **Attacks it.** Every line must finish "I chose X because this product...". A reason that fits any product is a default.
5. **Builds** from tokens, with real content.
6. **Verifies.** Runs the scanner, renders the page, and runs the silhouette, swap and squint tests.

Three modes: **build** (new UI), **unslop** (fix existing UI, keep behavior), **audit** (report only).

```
skills/unstyle/
  SKILL.md                  the process (short, loads on trigger)
  references/tells.md       63 tells with IDs, severity, why, fix
  references/grounding.md   worked examples, including the second-order traps
  references/craft.md       quality floor: type, OKLCH color, space, motion, states, a11y, dashboards
  references/design-md.md   DESIGN.md template so multi-page work does not drift
  scripts/scan.mjs          the scanner (Node 18+, no dependencies)
```

## The scanner

```bash
npx @m0xoo/unstyle src/                 # scan a folder
npx @m0xoo/unstyle app/page.tsx --min=P1
npx @m0xoo/unstyle src --json           # machine output
npx @m0xoo/unstyle --list               # all rules
```

It reads `.html .jsx .tsx .vue .svelte .astro .mdx .css .scss` and reports 36 code-level tells across color, type, layout, components, motion, copy, icons, second-order defaults and the accessibility floor. Exit code `2` if anything is P0 or P1, so it can gate CI.

```text
examples/before.html  (P0 11, P1 30, P2 12)
  P0 C1  L20   Purple/indigo gradient: from-indigo-500
             fix: Take the palette from the subject's world. A gradient needs a reason (light, material, data); purple-to-blue has none.
  P1 T1  L9    Default typeface (Inter, Roboto, Arial, Open Sans, Lato, Poppins, Montserrat): inter
  P1 L1  L34   Pill badge above the hero headline: inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px
  P1 W1  L38   Em dash in visible copy: l potential of your workforce — all in one powerful platform.
  ...
```

Severity: **P0** a layperson notices, **P1** a designer or developer notices, **P2** craft or a second-order default (fine when you can say why).

Keep a choice on purpose with a comment:

```html
<!-- unstyle-ignore: S2 (the client is a pottery studio) -->
/* unstyle-ignore-file: S1, L2 */
```

Rules are judged per file. A `prefers-reduced-motion` guard in a global stylesheet does not count for a component in another file (M1); mark those files with `unstyle-ignore-file: M1`.

The scanner only sees code. Hierarchy, rhythm, sameness of layout and real contrast need a rendered page; the skill covers those in its visual checks.

### Optional: run it after every edit in Claude Code

Install the CLI once (`npm i -g @m0xoo/unstyle`) so the hook does not pay for `npx` on every edit, then add to `.claude/settings.json`. On a P0/P1 the findings go back to the agent, which then fixes them. It reports the whole edited file, so existing tells in that file come back too.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "unstyle --hook" }]
      }
    ]
  }
}
```

## Development

```bash
npm test                 # scanner tests
npm run scan:examples    # the after page and index must stay clean
```

New tell: add it to `references/tells.md`. If it is certain from code, also add a rule in `scan.mjs`, a case in `scan.test.mjs`, and make sure `fixtures/clean.html` still passes. False positives are bugs.

## Upgrading from 1.x

1.x was an MCP server with eight fixed themes (`get_theme_guidelines`). Fixed themes turned out to be more defaults, so 2.0 replaces the server with a skill and a scanner. If you need the old server, pin `@m0xoo/unstyle@1.1.6`.

## Background

This rework builds on public work on the problem: Anthropic's [frontend design skill and write-up](https://claude.com/blog/improving-frontend-design-through-skills) (distributional convergence, and Claude moving to Space Grotesk once Inter was discouraged), [Impeccable](https://github.com/pbakaus/impeccable), [taste-skill](https://github.com/Leonxlnx/taste-skill), [avoid-ai-design](https://github.com/funboy322/avoid-ai-design) (second-order "tasteful" defaults) and Hallmark (pre-emit self-critique). The rules and text here are written from scratch.

## License

ISC
