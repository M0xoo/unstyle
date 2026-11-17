import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { scanText, RULES } from "./scan.mjs";

const fx = (n) => new URL(`./fixtures/${n}`, import.meta.url);
const ids = (file, text) => new Set(scanText(file, text).map((f) => f.id));

test("rule ids are unique", () => {
  const all = RULES.map((r) => r.id);
  assert.equal(new Set(all).size, all.length);
});

test("slop fixture trips the core tells", () => {
  const got = ids("slop.tsx", readFileSync(fx("slop.tsx"), "utf8"));
  for (const id of ["C1", "C2", "C3", "C4", "T1", "L1", "L2", "L3", "K1", "K2", "K3", "M1", "M5", "W1", "W2", "W3", "W4", "W5", "I1", "I2", "S6", "A3"]) {
    assert.ok(got.has(id), `expected ${id}, got ${[...got].join(",")}`);
  }
});

test("clean fixture has no findings", () => {
  const f = scanText("clean.html", readFileSync(fx("clean.html"), "utf8"));
  assert.deepEqual(f, [], JSON.stringify(f, null, 2));
});

test("CSS purple gradient by hex is caught, teal is not", () => {
  assert.ok(ids("a.css", ".h{background:linear-gradient(135deg,#6366f1,#8b5cf6)}").has("C1"));
  assert.ok(!ids("a.css", ".h{background:linear-gradient(135deg,#0f766e,#14b8a6)}").has("C1"));
});

test("unloaded font in a standalone HTML file", () => {
  const html = `<style>body{font-family:"Neue Haas Grotesk",sans-serif}</style><p>x</p>`;
  assert.ok(ids("a.html", html).has("T2"));
  const loaded = `<style>@font-face{font-family:"Neue Haas Grotesk";src:url(n.woff2)}body{font-family:"Neue Haas Grotesk",sans-serif}</style>`;
  assert.ok(!ids("a.html", loaded).has("T2"));
});

test("second-order defaults", () => {
  assert.ok(ids("a.css", `:root{--bg:#f5efe6;--accent:#c4643a}`).has("S2"));
  assert.ok(ids("a.css", `:root{--bg:#0a0a0a;--accent:#c6ff3d}`).has("S3"));
  assert.ok(ids("a.css", `body{font-family:"Instrument Serif",serif}`).has("S1"));
});

test("reduced-motion guard silences M1", () => {
  const css = "@keyframes a{from{opacity:0}} .x{animation:a 1s}";
  assert.ok(ids("a.css", css).has("M1"));
  assert.ok(!ids("a.css", css + " @media (prefers-reduced-motion: reduce){.x{animation:none}}").has("M1"));
});

test("em dash in code comments is ignored, in copy is caught", () => {
  assert.ok(!ids("a.html", "<!-- notes — here -->\n<p>Plain copy.</p>").has("W1"));
  assert.ok(ids("a.html", "<p>Fast — and simple.</p>").has("W1"));
  assert.ok(!ids("a.css", "/* a — b */ .x{}").has("W1"));
});

test("ignore comments", () => {
  const src = `<!-- unstyle-ignore: W1 -->\n<p>Fast — and simple.</p>`;
  assert.ok(!ids("a.html", src).has("W1"));
  const file = `<!-- unstyle-ignore-file: W1, W3 -->\n<p>a — b</p><button>Get started</button>`;
  const got = ids("a.html", file);
  assert.ok(!got.has("W1") && !got.has("W3"));
});

test("focus outline removal needs a replacement", () => {
  assert.ok(ids("a.css", "button{outline:none}").has("A1"));
  assert.ok(!ids("a.css", "button{outline:none} button:focus-visible{outline:2px solid}").has("A1"));
});

test("checkmarks and arrows are not emoji icons", () => {
  assert.ok(!ids("a.html", "<li>✓ Included</li><a>Next →</a><p>© 2026</p>").has("I2"));
  assert.ok(ids("a.html", "<li>🚀 Fast</li>").has("I2"));
});

test("a comment followed by code on one line does not hide the rest of the file", () => {
  assert.ok(ids("a.css", `/* reset */ * { box-sizing: border-box }\nbody { font-family: Inter, sans-serif }\n.h { background: linear-gradient(#6366f1, #8b5cf6) }`).has("C1"));
  assert.ok(ids("a.tsx", `{/* list */} <p>Rows</p>\n<p>Seamless sync</p>`).has("W2"));
  assert.ok(ids("a.html", `<!-- note --> <p>x</p>\n<p>Fast — simple</p>`).has("W1"));
});

test("trailing // comments are not scanned", () => {
  assert.ok(!ids("a.tsx", `const x = 1; // TODO: Sparkles icon later\n`).has("I1"));
});

test("inline style font-family is parsed", () => {
  const got = scanText("a.html", `<p style="font-family: Inter">hello</p>`);
  assert.ok(got.some((f) => f.id === "T1"));
  assert.ok(!got.some((f) => f.id === "T2" && /hello/.test(f.match)));
});

test("attributes and JSX expressions are not copy", () => {
  assert.ok(!ids("a.html", `<iframe seamless src="/x"></iframe><a href="/blog/next-gen-ui">Read</a>`).has("W2"));
  assert.ok(!ids("a.tsx", `<td>{r.name ?? "—"}</td>`).has("W1"));
});

test("spinners, max-h-screen and spread img are not flagged", () => {
  assert.ok(!ids("a.tsx", `<div className="animate-spin" />`).has("M1"));
  assert.ok(!ids("a.tsx", `<div className="max-h-screen overflow-auto" />`).has("L3"));
  assert.ok(!ids("a.tsx", `<img {...props} />`).has("A3"));
});

test("no catastrophic backtracking on hostile input", () => {
  const t0 = Date.now();
  scanText("a.html", "a".repeat(200000));
  scanText("a.css", "{ text-transform: uppercase ".repeat(5000) + "{".repeat(50000));
  assert.ok(Date.now() - t0 < 3000, `took ${Date.now() - t0}ms`);
});
