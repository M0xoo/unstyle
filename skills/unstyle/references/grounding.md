# Grounding: from subject to direction

The goal is a direction you could not have written for a different product. These examples show the method, not answers to copy. Their specific fonts and colors are illustrations; if you reuse them for an unrelated subject, they are defaults again.

## Finding the native artifact

Ask, about the subject:

1. What did people in this world use **before software**? (paper forms, instruments, signage, packaging, maps, logbooks)
2. What does a professional in this field **look at all day**? (a chart, a score, a spreadsheet, a camera viewfinder, a kitchen ticket)
3. What **conventions** does the field already have? (red for negative in accounting, magenta for hazards on nautical charts, a recipe's ingredient list before its method)
4. What is the **unit of content**? (a tide, a transaction, a bean lot, a command) Design the page around showing one of them very well.
5. What would an insider **notice was wrong**? That is where you put your care.

The artifact gives you a skeleton (how information is arranged), a palette (what the materials are), and a type voice (how it was printed or displayed). You translate, you do not imitate: a ledger-inspired tool does not need fake paper texture.

## Example 1: tide times for sea swimmers (expressive, but useful)

- **World**: tide table, Admiralty chart, depth soundings, buoys, kelp, slipway, spring and neap, chart datum.
- **Native artifact**: the printed tide table and the nautical chart.
- **Palette**: chart paper (a cool, faintly blue-green white, not cream), sounding ink (deep navy), shallow-water tint (pale blue the charts use for under 5 m), chart magenta for warnings (it is the real convention for hazards and lights), buoy orange for "now".
- **Type**: a sturdy slab or grotesk with excellent tabular figures for times and heights, because the page is mostly numbers read at a glance on a wet phone.
- **Skeleton**: the tide curve is the hero, full width, with a vertical line at the current time. Below it, a table, because the native artifact is a table.
- **Signature**: depth contours as section dividers, drawn from the real beach's chart.
- **Motion**: on load, the "now" line slides to the current time. Nothing else moves.
- **Voice**: plain, local, exact. Never "seamless", never "experience".

## Example 2: bookkeeping for freelancers (quiet register)

- **World**: ledger, invoice, receipt, VAT return, running balance, red ink, carried forward.
- **Native artifact**: the ledger book.
- **Palette**: white ground, black ink, one green for "paid" and accounting red for negative amounts (convention, so it needs no legend). No gradients anywhere.
- **Type**: one text family with true tabular, lining figures. Amounts right-aligned on the decimal.
- **Skeleton**: no hero. The first screen is the ledger: date, payee, category, amount, running balance. Filters above it, totals pinned below.
- **Signature**: the running balance column, and the "carried forward" row when you page.
- **Motion**: none, except the new row arriving after import.
- **Voice**: factual, short. "3 invoices overdue, €2,140", not "Stay on top of your finances!"

Here, unslopping mostly means **removing**: the stat cards with icons, the gradient header, the onboarding illustrations.

## Example 3: a specialty coffee roaster (the second-order trap)

The first idea for "artisan coffee" is cream, terracotta, an Instrument Serif headline and grain. That is S1 + S2 + S10, the new default for anything handmade. Go back to the world:

- **World**: green beans, roast curve, first crack, origin, altitude in metres, washed or natural process, cupping notes, the roaster's log.
- **Native artifact**: the roast profile chart (temperature over time) and the stamped bag label.
- **Palette**: from the beans through the roast. Unroasted green-grey, cinnamon, the specific brown of their usual roast level, and a rubber-stamp ink. Grounded in this roaster's product, not "warm and earthy".
- **Type**: a utilitarian face like a label stamp for data (origin, altitude, process), and a readable text face for the story.
- **Skeleton**: each coffee is a spec sheet: origin, farm, altitude, process, roast curve, then tasting notes. The shop is a list of lots, not cards.
- **Signature**: each lot's real roast curve, drawn small next to its name.
- **Voice**: the roaster's own notes. "Washed, 1,900 m, roasted 9 minutes 40, first crack at 7:55."

## Example 4: a CLI dev tool (the other trap)

The first idea is near-black, one acid-green accent, a mono font, a fake terminal with window dots. That is S3 + K4, the "dev-tool noir" default.

- **World**: man pages, RFCs, `--help` output, changelogs, flags, exit codes.
- **Native artifact**: the man page. Notice it is usually *dark text on light*, plain, and very well structured.
- **Skeleton**: NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES, EXIT STATUS. The landing page is the manual.
- **Type**: one good monospace for commands and output, a plain text face for prose.
- **Signature**: every example on the page is runnable and copyable, and shows real output.
- **Voice**: imperative, exact, flags in code.

## When the subject is thin

Sometimes the brief is "a landing page for my startup" and nothing else. Then:

1. Ask one question: what does it do, for whom.
2. If you still have nothing, use the **user's world** instead of the product's (who uses it, where, on what device, in what mood).
3. Still nothing: choose the quiet register. A plain, well-set, honest page beats a decorated generic one.
