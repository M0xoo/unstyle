#!/usr/bin/env node
// unstyle scan: finds code-certain "AI default" tells in frontend files.
// Zero dependencies. Node 18+. No model calls.
//
//   node scan.mjs [paths...] [--json] [--min=P0|P1|P2] [--hook] [--list]
//
// Exit 0: nothing at or above P1. Exit 2: at least one P0 or P1. Exit 1: usage error.
// Ignore a finding on purpose with a comment on the same or previous line:
//   unstyle-ignore: C1          (one line)
//   unstyle-ignore-file: S1, L2 (whole file)

import { readFileSync, readdirSync, statSync, existsSync, realpathSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { pathToFileURL } from "node:url";

const MARKUP = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".mdx"]);
const STYLE = new Set([".css", ".scss", ".sass", ".less"]);
const EXTS = new Set([...MARKUP, ...STYLE]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".svelte-kit", "out", "coverage", ".turbo", ".vercel", "vendor"]);
const SEV_RANK = { P0: 0, P1: 1, P2: 2 };

// ---------- color helpers ----------
function hexToHsl(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6);
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return rgbToHsl(r, g, b);
}
function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hue = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) hue = ((b - r) / d + 2) * 60;
    else hue = ((r - g) / d + 4) * 60;
  }
  return { h: hue, s, l };
}
function colorsIn(str) {
  const out = [];
  for (const m of str.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    const c = hexToHsl(m[0]);
    if (c) out.push({ ...c, raw: m[0], index: m.index });
  }
  for (const m of str.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/gi)) {
    out.push({ ...rgbToHsl(+m[1] / 255, +m[2] / 255, +m[3] / 255), raw: m[0], index: m.index });
  }
  for (const m of str.matchAll(/hsla?\(\s*(\d+(?:\.\d+)?)(?:deg)?[\s,]+(\d+(?:\.\d+)?)%[\s,]+(\d+(?:\.\d+)?)%/gi)) {
    out.push({ h: +m[1], s: +m[2] / 100, l: +m[3] / 100, raw: m[0], index: m.index });
  }
  for (const m of str.matchAll(/oklch\(\s*(\d+(?:\.\d+)?)(%?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/gi)) {
    // Rough mapping: OKLCH hue is close enough to HSL hue for the bands we test.
    const L = m[2] ? +m[1] / 100 : +m[1];
    out.push({ h: +m[4], s: Math.min(1, +m[3] / 0.25), l: L, raw: m[0], index: m.index, oklch: true });
  }
  return out;
}
const isPurple = (c) => c.h >= 238 && c.h <= 295 && c.s >= 0.35 && c.l >= 0.25 && c.l <= 0.85;
const isSaturated = (c) => c.s >= 0.55 && c.l >= 0.3 && c.l <= 0.8;
const isCream = (c) => c.h >= 25 && c.h <= 60 && c.s >= 0.15 && c.l >= 0.88 && c.l < 0.985;
const isTerracotta = (c) => c.h >= 5 && c.h <= 28 && c.s >= 0.35 && c.s <= 0.85 && c.l >= 0.35 && c.l <= 0.62;
const isNearBlack = (c) => c.l <= 0.09;
const isAcid = (c) => (c.h >= 60 && c.h <= 105 && c.s >= 0.7 && c.l >= 0.45 && c.l <= 0.7) || (c.h >= 4 && c.h <= 16 && c.s >= 0.85 && c.l >= 0.45 && c.l <= 0.6);

// ---------- font helpers ----------
const DEFAULT_FONTS = ["inter", "roboto", "arial", "open sans", "lato", "poppins", "montserrat", "helvetica neue"];
const SECOND_ORDER_FONTS = ["space grotesk", "geist", "instrument serif", "instrument sans", "fraunces", "playfair display", "plus jakarta sans", "dm sans", "dm serif display", "manrope", "outfit", "sora", "bricolage grotesque", "cormorant garamond", "cormorant"];
const SYSTEM_FONTS = new Set(["system-ui", "-apple-system", "blinkmacsystemfont", "segoe ui", "helvetica", "helvetica neue", "arial", "georgia", "times", "times new roman", "courier", "courier new", "menlo", "monaco", "consolas", "sf mono", "sf pro", "sf pro display", "sf pro text", "iowan old style", "palatino", "palatino linotype", "charter", "avenir", "avenir next", "optima", "gill sans", "verdana", "tahoma", "trebuchet ms", "ui-sans-serif", "ui-serif", "ui-monospace", "ui-rounded", "sans-serif", "serif", "monospace", "cursive", "fantasy", "inherit", "initial", "unset", "var", "emoji", "apple color emoji", "segoe ui emoji", "noto color emoji", "liberation mono", "dejavu sans mono", "roboto mono", "cascadia code", "noto sans", "ubuntu", "cantarell", "fira sans", "oxygen", "american typewriter", "baskerville", "didot", "hoefler text", "futura", "rockwell", "impact", "lucida grande", "lucida console", "garamond", "book antiqua", "bookman"]);
const norm = (s) => s.trim().replace(/^['"]|['"]$/g, "").trim().toLowerCase();

// Font names a file uses, from CSS, Google Fonts URLs, next/font, fontsource, Tailwind.
function fontUses(text) {
  const uses = [];
  for (const m of text.matchAll(/font-family\s*:\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^;,}"'\n]+))/gi)) {
    const first = norm(m[1] ?? m[2] ?? m[3]);
    if (first && !first.startsWith("var(")) uses.push({ name: first, index: m.index, kind: "css" });
  }
  for (const m of text.matchAll(/fonts\.googleapis\.com\/css2?\?([^"'\s)>]+)/gi)) {
    for (const f of m[1].matchAll(/family=([^:&;"']+)/gi)) uses.push({ name: decodeURIComponent(f[1]).replace(/\+/g, " ").toLowerCase(), index: m.index, kind: "load" });
  }
  for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/g)) {
    for (const n of m[1].split(",")) {
      const name = n.trim().split(/\s+as\s+/)[0].replace(/_/g, " ").toLowerCase();
      if (name) uses.push({ name, index: m.index, kind: "load" });
    }
  }
  for (const m of text.matchAll(/@fontsource(?:-variable)?\/([a-z0-9-]+)/gi)) uses.push({ name: m[1].replace(/-/g, " ").toLowerCase(), index: m.index, kind: "load" });
  for (const m of text.matchAll(/font-\[['"]?([A-Za-z][A-Za-z0-9_ ]+?)['"]?[,\]]/g)) uses.push({ name: m[1].replace(/_/g, " ").toLowerCase(), index: m.index, kind: "tw" });
  for (const m of text.matchAll(/(?:sans|serif|display|heading|body|mono)\s*:\s*\[\s*["']([^"']+)["']/g)) uses.push({ name: m[1].toLowerCase(), index: m.index, kind: "tw" });
  for (const m of text.matchAll(/--font-[\w-]+\s*:\s*([^;]+);/g)) {
    const first = norm(m[1].split(",")[0]);
    if (first && !first.startsWith("var(")) uses.push({ name: first, index: m.index, kind: "css" });
  }
  return uses;
}

// ---------- context ----------
function makeCtx(file, raw) {
  const ext = extname(file).toLowerCase();
  const jsLike = MARKUP.has(ext) && ext !== ".html" && ext !== ".htm";
  // Comments are blanked (same length, newlines kept) so every rule sees code only and line numbers stay right.
  let text = raw
    .replace(/<!--[\s\S]*?(?:-->|$)/g, blank)
    .replace(/(?<=^|[\s{};>(,])\/\*[\s\S]*?(?:\*\/|$)/g, blank);
  if (jsLike || ext === ".scss" || ext === ".less") text = text.replace(/(?<=^|[\s;{}])\/\/[^\n]*/gm, blank);
  const lines = raw.split(/\r?\n/);
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  const lineOf = (idx) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= idx) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
  // Visible copy: text nodes only. Style, script, imports, tags and JSX expressions are blanked.
  let copy = "";
  if (MARKUP.has(ext)) {
    copy = text
      .replace(/<style[\s\S]*?<\/style>/gi, blank)
      .replace(/<script(?![^>]*type=["']?text\/(?:babel|jsx))[\s\S]*?<\/script>/gi, blank)
      .replace(/^\s*(?:import|export\s+(?:const|let|function|type|interface))\b.*$/gm, blank)
      .replace(/<[^<>]*>/g, blank);
    if (jsLike) {
      // Blank one-line {expressions} (two levels of nesting; multi-line braces are usually function bodies), but keep plain string literals inside them as copy.
      for (let i = 0; i < 2; i++) copy = copy.replace(/\{[^{}\n]*\}/g, (m) => (/^\{\s*(["'`])[^"'`]*\1\s*\}$/.test(m) ? m : blank(m)));
    }
  }
  return { file, ext, raw, text, lines, lineOf, commentLines: new Set(), copy, isMarkup: MARKUP.has(ext), isStyle: STYLE.has(ext), isHtml: ext === ".html" || ext === ".htm" };
}
function blank(s) { return s.replace(/[^\n]/g, " "); }

// Collect class attribute values with their index.
function classLists(text) {
  const out = [];
  for (const m of text.matchAll(/\bclass(?:Name)?\s*=\s*(?:\{\s*(?:cn|clsx|cx|twMerge)?\(?\s*)?(["'`])([\s\S]*?)\1/g)) out.push({ value: m[2], index: m.index });
  return out;
}

function eachMatch(ctx, re, src = ctx.text) {
  const hits = [];
  const seen = new Set();
  for (const m of src.matchAll(re)) {
    const line = ctx.lineOf(m.index);
    if (ctx.commentLines.has(line) || seen.has(line)) continue;
    seen.add(line);
    hits.push({ line, match: m[0].trim().slice(0, 80) });
  }
  return hits;
}
const firstOf = (hits, n, threshold, label) => (hits.length >= threshold ? [{ line: hits[0].line, match: `${hits.length} ${label}` }] : []);

// ---------- rules ----------
// Each rule: id, sev, title, fix, test(ctx) -> [{line, match}]
export const RULES = [
  // ----- Color -----
  {
    id: "C1", sev: "P0", title: "Purple/indigo gradient",
    fix: "Take the palette from the subject's world. A gradient needs a reason (light, material, data); purple-to-blue has none.",
    test(ctx) {
      const hits = eachMatch(ctx, /\b(?:from|via|to)-(?:indigo|purple|violet|fuchsia)-\d{2,3}\b/g);
      for (const m of ctx.text.matchAll(/(?:linear|radial|conic)-gradient\(([^;"'`]*)/gi)) {
        const line = ctx.lineOf(m.index);
        if (ctx.commentLines.has(line) || hits.some((h) => h.line === line)) continue;
        const cs = colorsIn(m[1]);
        if (cs.some(isPurple) || /\b(?:purple|indigo|violet|blueviolet|rebeccapurple)\b/i.test(m[1])) hits.push({ line, match: m[0].slice(0, 80) });
      }
      return hits;
    },
  },
  {
    id: "C2", sev: "P1", title: "Gradient-filled headline text",
    fix: "Set the headline in one solid ink. Let size, weight and the typeface carry emphasis.",
    test: (ctx) => eachMatch(ctx, /bg-clip-text|background-clip\s*:\s*text|-webkit-text-fill-color\s*:\s*transparent/g),
  },
  {
    id: "C3", sev: "P1", title: "Neon glow shadow",
    fix: "Shadows describe light and elevation. Use a soft neutral shadow, a border, or nothing.",
    test(ctx) {
      const hits = eachMatch(ctx, /\bshadow-(?:indigo|purple|violet|fuchsia|cyan|pink|blue|sky|emerald|green|lime)-\d{3}(?:\/\d+)?\b|drop-shadow-\[0_0_/g);
      for (const m of ctx.text.matchAll(/(?:box|text)-shadow\s*:\s*([^;]+)/gi)) {
        const line = ctx.lineOf(m.index);
        if (ctx.commentLines.has(line) || hits.some((h) => h.line === line)) continue;
        if (/(?:^|,)\s*0(?:px)?\s+0(?:px)?\s+(?:[2-9]\d|\d{3})px/.test(m[1]) && colorsIn(m[1]).some(isSaturated)) hits.push({ line, match: m[0].slice(0, 80) });
      }
      return hits;
    },
  },
  {
    id: "C4", sev: "P1", title: "Tailwind indigo used as the brand color",
    fix: "indigo-500/600 is the framework default, not a brand. Define your own accent token and use it.",
    test(ctx) {
      const all = [...ctx.text.matchAll(/\b(?:bg|text|ring|border|outline|fill|stroke|accent|decoration)-indigo-(?:500|600|700)\b/g)].filter((m) => !ctx.commentLines.has(ctx.lineOf(m.index)));
      return all.length >= 3 ? [{ line: ctx.lineOf(all[0].index), match: `${all.length} indigo-500/600/700 utilities` }] : [];
    },
  },
  {
    id: "C5", sev: "P2", title: "Untouched shadcn/ui default tokens",
    fix: "Re-derive --background, --primary, --muted and --radius from your direction. Default tokens ship the default look.",
    test: (ctx) => eachMatch(ctx, /--(?:background|foreground|primary|card)\s*:\s*(?:222\.2\s+84%\s+4\.9%|222\.2\s+47\.4%\s+11\.2%|0\s+0%\s+100%|240\s+10%\s+3\.9%|240\s+5\.9%\s+10%|oklch\(0\.145 0 0\)|oklch\(0\.205 0 0\))/g),
  },

  // ----- Type -----
  {
    id: "T1", sev: "P1", title: "Default typeface (Inter, Roboto, Arial, Open Sans, Lato, Poppins, Montserrat)",
    fix: "Pick a face for a reason tied to the subject. If the product truly needs a neutral UI sans, say why and pair it with a face that has a point of view.",
    test(ctx) {
      const hits = [];
      const seen = new Set();
      for (const u of fontUses(ctx.text)) {
        if (!DEFAULT_FONTS.includes(u.name)) continue;
        const line = ctx.lineOf(u.index);
        if (ctx.commentLines.has(line) || seen.has(line)) continue;
        seen.add(line);
        hits.push({ line, match: u.name });
      }
      return hits;
    },
  },
  {
    id: "S1", sev: "P2", title: "Second-order default typeface (the 'tasteful' picks models now converge on)",
    fix: "Space Grotesk, Geist, Instrument Serif, Fraunces, Playfair and friends are the new median. Keep one only if you can say why this subject wants it.",
    test(ctx) {
      const hits = [];
      const seen = new Set();
      for (const u of fontUses(ctx.text)) {
        if (!SECOND_ORDER_FONTS.includes(u.name) || seen.has(u.name)) continue;
        const line = ctx.lineOf(u.index);
        if (ctx.commentLines.has(line)) continue;
        seen.add(u.name);
        hits.push({ line, match: u.name });
      }
      return hits;
    },
  },
  {
    id: "T2", sev: "P1", title: "Font declared but never loaded",
    fix: "Load it (@font-face, a <link>, next/font) or drop it. Right now the page renders in the fallback.",
    test(ctx) {
      if (!ctx.isHtml) return [];
      if (/<link[^>]+rel=["']?stylesheet[^>]+href=["']?(?!https?:\/\/fonts\.)[^"'>]+\.css/i.test(ctx.text) || /@import\s+(?:url\()?["'](?!https?:\/\/fonts\.)/i.test(ctx.text)) return []; // fonts may come from an external sheet
      const loaded = ctx.text.toLowerCase();
      const hits = [];
      const seen = new Set();
      for (const u of fontUses(ctx.text)) {
        if (u.kind !== "css" || SYSTEM_FONTS.has(u.name) || seen.has(u.name)) continue;
        seen.add(u.name);
        const plus = u.name.replace(/ /g, "+");
        const faceRe = new RegExp(`@font-face[^}]*font-family\\s*:\\s*["']?${u.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
        if (loaded.includes(`family=${plus}`) || loaded.includes(`family=${u.name}`) || faceRe.test(ctx.text) || loaded.includes(`fontsource/${u.name.replace(/ /g, "-")}`) || loaded.includes(`fontsource-variable/${u.name.replace(/ /g, "-")}`)) continue;
        hits.push({ line: ctx.lineOf(u.index), match: u.name });
      }
      return hits;
    },
  },

  // ----- Layout -----
  {
    id: "L1", sev: "P1", title: "Pill badge above the hero headline",
    fix: "Delete it, or turn it into real information (a date, a version, a status) set in the page's own type.",
    test(ctx) {
      const h1 = ctx.text.search(/<h1\b/i);
      if (h1 < 0) return [];
      const before = ctx.text.slice(Math.max(0, h1 - 1500), h1);
      const offset = Math.max(0, h1 - 1500);
      for (const c of classLists(before)) {
        const v = c.value;
        if (/\brounded-full\b/.test(v) && /\btext-(?:xs|sm)\b/.test(v) && /\bpx-(?:2\.5|3|4)\b/.test(v) && /\b(?:border|bg-)/.test(v) && !/\b(?:w|h|size)-\d/.test(v)) return [{ line: ctx.lineOf(offset + c.index), match: v.slice(0, 80) }];
      }
      return [];
    },
  },
  {
    id: "L2", sev: "P2", title: "Three equal columns",
    fix: "If these are three parallel feature cards, break the symmetry: one lead item and two supports, a list, a table, a sequence. Real content is rarely three equal things.",
    test: (ctx) => eachMatch(ctx, /\b(?:sm:|md:|lg:|xl:)?grid-cols-3\b|grid-template-columns\s*:\s*repeat\(\s*3\s*,\s*(?:1fr|minmax)/g).slice(0, 3),
  },
  {
    id: "L3", sev: "P2", title: "100vh / h-screen for full-height sections",
    fix: "Use 100dvh (min-h-dvh) so mobile browser chrome does not crop the section.",
    test: (ctx) => eachMatch(ctx, /(?<![\w-])(?:min-)?h-screen\b|\b100vh\b/g).slice(0, 3),
  },

  // ----- Components -----
  {
    id: "K1", sev: "P1", title: "rounded-2xl + shadow-lg on everything (the SaaS card kit)",
    fix: "Pick one radius and one elevation system for the whole page. Most surfaces need a border or nothing, not a floating card.",
    test(ctx) {
      const hits = classLists(ctx.text).filter((c) => /\brounded-(?:2xl|3xl)\b/.test(c.value) && /\bshadow-(?:md|lg|xl|2xl)\b/.test(c.value));
      return hits.length >= 3 ? [{ line: ctx.lineOf(hits[0].index), match: `${hits.length} elements with rounded-2xl/3xl + shadow-lg` }] : [];
    },
  },
  {
    id: "K2", sev: "P1", title: "Reflexive glassmorphism",
    fix: "Blur only where something real sits behind (a sticky bar over content). Opaque surfaces read better and cost less.",
    test: (ctx) => firstOf(eachMatch(ctx, /\bbackdrop-blur(?:-\w+)?\b|backdrop-filter\s*:\s*blur/g), 0, 3, "backdrop-blur surfaces"),
  },
  {
    id: "K3", sev: "P1", title: "Icon in a tinted rounded square",
    fix: "The icon tile above every heading is a template part. Drop the icons, or use something specific: a number that matters, a tiny real screenshot, a diagram.",
    test(ctx) {
      const hits = classLists(ctx.text).filter((c) => {
        const v = c.value;
        const sized = /\b(?:size-(?:8|9|10|11|12|14|16)|w-(?:8|9|10|11|12|14|16)\b[\s\S]*\bh-(?:8|9|10|11|12|14|16))\b/.test(v);
        return sized && /\brounded-(?:md|lg|xl|2xl|full)\b/.test(v) && /\bbg-/.test(v) && /\b(?:items-center|place-items-center|grid)\b/.test(v);
      });
      return hits.length >= 2 ? [{ line: ctx.lineOf(hits[0].index), match: `${hits.length} icon tiles` }] : [];
    },
  },
  {
    id: "K4", sev: "P2", title: "Fake macOS window dots",
    fix: "Show the real product or nothing. Traffic-light dots are decoration pretending to be a screenshot.",
    test(ctx) {
      const hits = eachMatch(ctx, /#(?:ff5f57|ff5f56|febc2e|ffbd2e|28c840|27c93f)\b/gi).slice(0, 1);
      if (hits.length) return hits;
      for (let i = 0; i < ctx.lines.length; i++) {
        const win = ctx.lines.slice(i, i + 4).join(" ");
        if (/bg-red-(?:400|500)/.test(ctx.lines[i]) && /bg-(?:yellow|amber)-(?:400|500)/.test(win) && /bg-(?:green|emerald)-(?:400|500)/.test(win) && /rounded-full/.test(win)) return [{ line: i + 1, match: "red/yellow/green dots" }];
      }
      return [];
    },
  },

  // ----- Motion -----
  {
    id: "M1", sev: "P1", title: "Animation without a reduced-motion path",
    fix: "Wrap non-essential motion in @media (prefers-reduced-motion: no-preference), motion-safe:, or useReducedMotion().",
    test(ctx) {
      if (/prefers-reduced-motion|useReducedMotion|motion-reduce:|motion-safe:|reducedMotion|MotionConfig/.test(ctx.text)) return [];
      const hits = eachMatch(ctx, /@keyframes\s+[\w-]+|\banimation\s*:\s*(?!none)[\w-]|\banimate-(?!none\b|spin\b|pulse\b)[\w-]+|from\s+["'](?:framer-motion|motion\/react|gsap)["']|\bwhileInView\b|\bgsap\.\w+\(/g);
      return hits.length ? [{ line: hits[0].line, match: hits[0].match }] : [];
    },
  },
  {
    id: "M2", sev: "P2", title: "Bounce easing",
    fix: "Bounce reads as toy. Use a firm ease-out (cubic-bezier(0.2, 0, 0, 1)) or a well-damped spring.",
    test: (ctx) => eachMatch(ctx, /\banimate-bounce\b|easeOutBounce|easeInOutBounce|\bease-bounce\b|bounce\.out/g),
  },
  {
    id: "M3", sev: "P2", title: "Hover lift on every card",
    fix: "Lift says 'this moves'. Keep hover feedback for things you click, and make it quieter than a jump.",
    test: (ctx) => firstOf(eachMatch(ctx, /\bhover:(?:-translate-y-\S+|scale-1(?:0[2-9]|[1-9]\d))\b|:hover[^{]*\{[^}]*transform\s*:\s*(?:translateY\(-|scale\(1\.[0-9])/g), 0, 3, "hover lift/scale effects"),
  },
  {
    id: "M4", sev: "P2", title: "Count-up stats",
    fix: "Show the number. Counting up adds nothing and hides the value from fast readers and screenshots.",
    test: (ctx) => eachMatch(ctx, /\bCountUp\b|\buseCountUp\b|\bcountUp\(|\banimateValue\(|\bNumberTicker\b/g),
  },
  {
    id: "M5", sev: "P2", title: "transition: all",
    fix: "Transition the properties that change (color, opacity, transform). 'all' animates layout by accident.",
    test: (ctx) => eachMatch(ctx, /\btransition-all\b|transition\s*:\s*all\b/g).slice(0, 2),
  },

  // ----- Words -----
  {
    id: "W1", sev: "P1", title: "Em dash in visible copy",
    fix: "Use a period, a comma, a colon or parentheses. The em dash is the most reliable machine-copy tell.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      return eachMatch(ctx, /[^\n<>{}]{0,30}(?:—|&mdash;|&#8212;|\s–\s)[^\n<>{}]{0,30}/g, ctx.copy).slice(0, 8);
    },
  },
  {
    id: "W2", sev: "P1", title: "Stock marketing phrasing",
    fix: "Say what the product does, for whom, in the user's words. A verb like 'elevate' fits every product, so it says nothing.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      return eachMatch(ctx, /\b(?:elevate[sd]?|seamless(?:ly)?|supercharge[sd]?|unleash(?:es|ed)?|revolutioni[sz]e[sd]?|effortless(?:ly)?|game[- ]chang(?:er|ing)|cutting[- ]edge|next[- ]gen(?:eration)?|empower(?:s|ing)?|unlock (?:the|your) (?:power|potential|full)|take (?:your|it) \w+ to the next level|in today'?s fast[- ]paced|built for the modern|say goodbye to|reimagine[sd]?|harness the power|world[- ]class|best[- ]in[- ]class|all[- ]in[- ]one platform|lightning[- ]fast|blazing(?:ly)?[- ]fast)\b/gi, ctx.copy);
    },
  },
  {
    id: "W3", sev: "P2", title: "Generic call to action",
    fix: "Name the outcome: 'Book a table', 'Import your CSV', 'Read the spec'. 'Get started' fits every page.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      return eachMatch(ctx, />\s*(?:Get [Ss]tarted(?: (?:for free|now|today))?|Learn [Mm]ore|Start (?:for free|now)|Try it (?:free|now)|Sign up now|Join now|Explore more)\s*(?:→|&rarr;|->)?\s*</g);
    },
  },
  {
    id: "W4", sev: "P0", title: "Placeholder people, brands or text",
    fix: "Use real or plausible, specific content. 'Acme' and 'John Doe' tell the reader nothing was decided.",
    test: (ctx) => eachMatch(ctx, /\b(?:John|Jane) (?:Doe|Smith)\b|\bAcme(?: Inc| Corp)?\b|\blorem ipsum\b|via\.placeholder\.com|placehold\.co|i\.pravatar\.cc|randomuser\.me|picsum\.photos|source\.unsplash\.com/gi),
  },
  {
    id: "W5", sev: "P2", title: "Round-number social proof",
    fix: "Fake-sounding stats ('10,000+ teams', '99.9% uptime', '10x faster') hurt trust. Use a real, specific number with its source, or none.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      return eachMatch(ctx, /\b\d{1,3}(?:[,.]\d{3})*\s?[kKmM]?\+\s*(?:<[^>]+>\s*)?(?:happy |active )?(?:users|customers|teams|developers|companies|businesses|creators|downloads)\b|\b99\.9+%|\b10x (?:faster|more|better)\b/gi, ctx.copy);
    },
  },

  // ----- Icons and imagery -----
  {
    id: "I1", sev: "P1", title: "Sparkle icon for 'AI'",
    fix: "Sparkles mean nothing specific. Name the action ('Summarize', 'Draft reply') and drop the icon.",
    test: (ctx) => eachMatch(ctx, /\bSparkles?(?:Icon)?\b(?=[\s,}/>])|✨|:sparkles:/g),
  },
  {
    id: "I2", sev: "P1", title: "Emoji used as interface icons",
    fix: "Emoji render differently per platform and read as filler. Use a real icon set sparingly, or typography alone.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      return eachMatch(ctx, /(?![✓✔✕✖←-⇿©®™])\p{Extended_Pictographic}️?[^\n<>{}]{0,24}/gu, ctx.copy).slice(0, 5);
    },
  },

  // ----- Second-order defaults (the 'tasteful' look models moved to) -----
  {
    id: "S2", sev: "P2", title: "Cream background with terracotta accent",
    fix: "This is the new purple gradient. Keep it only if the subject is literally clay, paper, or a warm print artifact; otherwise derive the palette again.",
    test(ctx) {
      const cs = colorsIn(ctx.text);
      const t = cs.find(isTerracotta);
      return cs.some(isCream) && t ? [{ line: ctx.lineOf(t.index), match: t.raw }] : [];
    },
  },
  {
    id: "S3", sev: "P2", title: "Near-black with one acid-green or vermilion signal",
    fix: "The 'dev-tool noir' default. If the product lives in a terminal, fine, say so; otherwise choose colors the subject owns.",
    test(ctx) {
      const cs = colorsIn(ctx.text);
      const a = cs.find(isAcid);
      return cs.some(isNearBlack) && a ? [{ line: ctx.lineOf(a.index), match: a.raw }] : [];
    },
  },
  {
    id: "S4", sev: "P2", title: "Tracked uppercase eyebrow labels everywhere",
    fix: "A small caps label over every section is template chrome. Keep labels only where they name real data.",
    test(ctx) {
      const tw = classLists(ctx.text).filter((c) => /\buppercase\b/.test(c.value) && /\btracking-(?:wide|wider|widest|\[0?\.[1-9]\d*em\])\b/.test(c.value));
      const css = [...ctx.text.matchAll(/\{[^{}]{0,2000}\}/g)].filter((b) => /text-transform\s*:\s*uppercase/i.test(b[0]) && /letter-spacing\s*:\s*0?\.(?:[1-9]|0[89])\d*em/i.test(b[0]));
      const n = tw.length + css.length;
      const first = tw[0]?.index ?? css[0]?.index;
      return n >= 3 ? [{ line: ctx.lineOf(first), match: `${n} tracked uppercase labels` }] : [];
    },
  },
  {
    id: "S5", sev: "P2", title: "Decorative 01 / 02 / 03 numbering",
    fix: "Number things only when order matters to the reader (steps, a ranked list). Otherwise it is ornament.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      const hits = eachMatch(ctx, />\s*0[1-9](?:\s*[./—–-]|\s*<)/g);
      return hits.length >= 3 ? [{ line: hits[0].line, match: `${hits.length} zero-padded section numbers` }] : [];
    },
  },
  {
    id: "S6", sev: "P2", title: "One accented word in the headline",
    fix: "The colored or italic serif word in the H1 is a template move. Let the whole line work, or emphasize with structure.",
    test(ctx) {
      const hits = [];
      for (const m of ctx.text.matchAll(/<h1\b[^>]*>([\s\S]{0,400}?)<\/h1>/gi)) {
        if (/<(?:span|em|i|mark)\b[^>]*(?:class(?:Name)?=["'{][^"'}]*(?:gradient|bg-clip-text|text-(?:indigo|purple|violet|primary|accent|brand|orange|amber|emerald|lime|rose)|italic|font-serif|accent)|style=["'][^"']*(?:color|font-style))/i.test(m[1]) || /<em\b/i.test(m[1])) hits.push({ line: ctx.lineOf(m.index), match: "accented span inside <h1>" });
      }
      return hits;
    },
  },
  {
    id: "S7", sev: "P2", title: "Dot-separated meta strings",
    fix: "'Design · Build · Ship' strings are filler chrome. Write a sentence or cut it.",
    test(ctx) {
      if (!ctx.isMarkup) return [];
      return eachMatch(ctx, /(?<![A-Za-z0-9])[A-Za-z0-9]{1,40}(?:[ \t]*(?:·|&middot;|•)[ \t]*[A-Za-z0-9]{1,40}){2,8}/g, ctx.copy).slice(0, 3);
    },
  },

  // ----- Accessibility floor -----
  {
    id: "A1", sev: "P1", title: "Focus outline removed with no replacement",
    fix: "Add a visible :focus-visible style (2px ring, 3:1 contrast). Keyboard users need to see where they are.",
    test(ctx) {
      if (/focus-visible|focus:ring|focus:border|focus:shadow|focus:outline-(?!none)|:focus\b(?![\w-])|focus-within/.test(ctx.text)) return [];
      return eachMatch(ctx, /\boutline-none\b|outline\s*:\s*(?:none|0)\b/g).slice(0, 1);
    },
  },
  {
    id: "A2", sev: "P1", title: "Pinch zoom disabled",
    fix: "Remove maximum-scale / user-scalable=no from the viewport meta.",
    test: (ctx) => eachMatch(ctx, /user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*1(?:\.0)?\b/g),
  },
  {
    id: "A3", sev: "P1", title: "Image without alt",
    fix: "Add alt text that says what the image shows, or alt=\"\" if it is decoration.",
    test: (ctx) => eachMatch(ctx, /<img\b(?![^>]*(?:\balt\s*=|\{\s*\.\.\.))[^>]*>/gi),
  },
];

// ---------- scanning ----------
function ignoresFor(ctx) {
  const file = new Set();
  const byLine = new Map();
  ctx.lines.forEach((ln, i) => {
    const f = ln.match(/unstyle-ignore-file\s*:?\s*([A-Z]\d(?:\s*,\s*[A-Z]\d)*|all)/);
    if (f) f[1].split(/\s*,\s*/).forEach((id) => file.add(id));
    const l = ln.match(/unstyle-ignore(?!-file)\s*:?\s*([A-Z]\d(?:\s*,\s*[A-Z]\d)*|all)/);
    if (l) {
      const ids = l[1].split(/\s*,\s*/);
      for (const n of [i + 1, i + 2]) byLine.set(n, [...(byLine.get(n) || []), ...ids]);
    }
  });
  return { file, byLine };
}

export function scanText(file, text) {
  const ctx = makeCtx(file, text);
  const ig = ignoresFor(ctx);
  const findings = [];
  for (const r of RULES) {
    if (ig.file.has(r.id) || ig.file.has("all")) continue;
    let hits = [];
    try { hits = r.test(ctx) || []; } catch (e) { hits = []; }
    for (const h of hits) {
      const lineIg = ig.byLine.get(h.line) || [];
      if (lineIg.includes(r.id) || lineIg.includes("all")) continue;
      findings.push({ id: r.id, sev: r.sev, title: r.title, fix: r.fix, line: h.line, match: h.match });
    }
  }
  findings.sort((a, b) => SEV_RANK[a.sev] - SEV_RANK[b.sev] || a.line - b.line);
  return findings;
}

function walk(p, out) {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) {
    for (const name of readdirSync(p)) {
      if (SKIP_DIRS.has(name) || name.startsWith(".")) continue;
      walk(join(p, name), out);
    }
  } else if (EXTS.has(extname(p).toLowerCase())) out.push(p);
}

export function scanPaths(paths) {
  const files = [];
  for (const p of paths) walk(p, files);
  return files.map((f) => ({ file: f, findings: scanText(f, readFileSync(f, "utf8")) }));
}

function format(results, cwd) {
  const out = [];
  const tot = { P0: 0, P1: 0, P2: 0 };
  for (const r of results) {
    if (!r.findings.length) continue;
    const c = { P0: 0, P1: 0, P2: 0 };
    r.findings.forEach((f) => c[f.sev]++);
    Object.keys(c).forEach((k) => (tot[k] += c[k]));
    out.push(`\n${relative(cwd, r.file) || r.file}  (P0 ${c.P0}, P1 ${c.P1}, P2 ${c.P2})`);
    const told = new Set();
    for (const f of r.findings) {
      out.push(`  ${f.sev} ${f.id.padEnd(3)} L${String(f.line).padEnd(5)}${f.title}: ${f.match}`);
      if (!told.has(f.id)) out.push(`             fix: ${f.fix}`);
      told.add(f.id);
    }
  }
  const scanned = results.length;
  const flagged = results.filter((r) => r.findings.length).length;
  out.push(`\n${scanned} file(s) scanned, ${flagged} with findings. P0 ${tot.P0}, P1 ${tot.P1}, P2 ${tot.P2}.`);
  if (!tot.P0 && !tot.P1) out.push("No P0/P1 tells. The scanner only sees code; still render the page and run the visual checks in SKILL.md.");
  return { text: out.join("\n"), tot };
}

function filterMin(results, min) {
  return results.map((r) => ({ ...r, findings: r.findings.filter((f) => SEV_RANK[f.sev] <= SEV_RANK[min]) }));
}

async function readStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

async function main(argv) {
  const args = [];
  const flags = new Set();
  let minArg;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--min") { minArg = argv[++i] || ""; flags.add("--min"); }
    else if (a.startsWith("--min=")) { minArg = a.slice(6); flags.add("--min"); }
    else if (a.startsWith("-") && a !== "-") flags.add(a.split("=")[0]);
    else args.push(a);
  }
  const min = minArg !== undefined ? minArg.toUpperCase() : "P2";
  if (!(min in SEV_RANK)) { console.error(`unstyle: bad --min value "${min}" (use P0, P1 or P2)`); return 1; }

  if (flags.has("--help") || flags.has("-h")) {
    console.log("usage: unstyle [paths...] [--json] [--min=P0|P1|P2] [--hook] [--list]\nScans .html .jsx .tsx .vue .svelte .astro .mdx .css .scss for AI-default design tells.\nExit 2 if any P0/P1 finding, 0 otherwise.");
    return 0;
  }
  if (flags.has("--list")) {
    for (const r of RULES) console.log(`${r.sev} ${r.id.padEnd(3)} ${r.title}`);
    return 0;
  }
  if (flags.has("--hook")) {
    // Claude Code PostToolUse hook: read the edited file from stdin JSON, report P0/P1 to stderr.
    let file;
    try { file = JSON.parse(await readStdin())?.tool_input?.file_path; } catch { return 0; }
    if (!file || !EXTS.has(extname(file).toLowerCase()) || !existsSync(file)) return 0;
    const res = filterMin(scanPaths([file]), minArg ? min : "P1");
    const { text, tot } = format(res, process.cwd());
    if (tot.P0 + tot.P1 + (minArg && min === "P2" ? tot.P2 : 0) === 0) return 0;
    console.error(`unstyle found design tells in ${file}:${text}`);
    return 2;
  }

  const targets = args.length ? args : ["."];
  for (const t of targets) if (!existsSync(t)) { console.error(`unstyle: no such path: ${t}`); return 1; }
  const res = filterMin(scanPaths(targets), min);
  if (flags.has("--json")) {
    console.log(JSON.stringify(res.filter((r) => r.findings.length), null, 2));
  } else {
    console.log(format(res, process.cwd()).text);
  }
  return res.some((r) => r.findings.some((f) => f.sev !== "P2")) ? 2 : 0;
}

function isMain() {
  try { return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href; } catch { return false; }
}
if (isMain()) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}
