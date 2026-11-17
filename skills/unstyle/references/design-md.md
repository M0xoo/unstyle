# DESIGN.md template

When work spans more than one page or session, write the direction down so later pages do not drift back to the defaults. Put this file at the project root. Every new page is built from it; update it when a decision changes, not silently in code.

```markdown
# DESIGN.md

## Subject
<product, user, the one job, in two sentences>

## World
<5 to 8 nouns from the subject's world> · Native artifact: <what this domain made before software>

## Register
<expressive | quiet> because <reason>

## Palette (OKLCH)
| role        | light                  | dark                   | because |
|-------------|------------------------|------------------------|---------|
| ground      | oklch(0.98 0.01 200)   | oklch(0.18 0.01 200)   | ...     |
| surface     | ...                    | ...                    |         |
| ink         | ...                    | ...                    |         |
| ink-muted   | ...                    | ...                    |         |
| line        | ...                    | ...                    |         |
| accent      | ...                    | ...                    |         |
| danger      | ...                    | ...                    |         |

## Type
- Display: <family, weights> because <reason>
- Text: <family, weights> because <reason>
- Scale: <ratio> → <sizes>
- Numbers: tabular in <where>

## Space and shape
- Space scale: 4, 8, 12, 16, 24, 32, 48, 64
- Radius: <values and where>
- Elevation: <borders vs shadows, when>

## Skeleton
<one sentence layout idea, from the native artifact>

## Signature
<the one detail only this product has>

## Motion
<the one moment, durations, easing, reduced-motion behavior>

## Voice
<3 words> · Never: <words>

## Intentional exceptions
<any scanner rule kept on purpose, with the ID and the reason>
```

Mirror the tokens in code (`:root` custom properties or the Tailwind theme) with the same names, so the file and the code cannot disagree silently.
