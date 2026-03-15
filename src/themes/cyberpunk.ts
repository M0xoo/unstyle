import { ThemeGuidelines } from "../types.js";

export const cyberpunk: ThemeGuidelines = {
    inspiration: "High-tech, low-life aesthetic. Dark modes dominated by neon glowing accents, grids, and terminal-inspired UI.",
    examples: ["cyberpunk.net", "hackthebox.com"],
    design_principles: [
        "High contrast dark surfaces with selective neon emphasis.",
        "Technical mood through geometry, grid overlays, and mono typography.",
        "Glow should communicate priority, not cover every element.",
        "Keep interface legible before adding glitch or atmospheric effects."
    ],
    rules: [
        "Pure black backgrounds (or very dark navy/purple).",
        "Glowing elements (box-shadow or text-shadow).",
        "Glitch effects or CRT scanlines.",
        "Angled cuts or clipped corners (clip-path).",
        "Reserve one dominant neon accent per screen to avoid visual noise.",
        "Use deterministic spacing tokens so complex visuals remain navigable."
    ],
    what_to_use: ["Neon colors (cyan, magenta, yellow)", "Monospace fonts", "CSS clip-path for structural shapes", "Dark/glass layered panels"],
    what_not_to_use: ["White backgrounds", "Soft pastel colors", "Rounded buttons (pills)", "Friendly serif fonts"],
    accessibility: [
        "Neon text on black must still pass 4.5:1 for body copy.",
        "Keep glow radius moderate so glyph edges remain crisp.",
        "Reduce flicker and strobe effects; avoid seizure-triggering patterns.",
        "Provide standard focus indicators independent of glow effects."
    ],
    color_palette: {
        primary: "#FCEE0A, #00FF41, #FF003C",
        background: "#080808, #120458",
        text: "#E0E0E0, #00FF41",
        accent: "#00E5FF"
    },
    typography: {
        headers: "Oxanium, Orbitron, VT323",
        body: "Fira Code, JetBrains Mono, Roboto Mono",
        weights: "400, 700"
    },
    component_guidelines: {
        buttons: "clip-path-polygon-[10%_0,100%_0,100%_70%,90%_100%,0_100%,0_30%] bg-yellow-400 text-black font-bold uppercase px-8 py-3 hover:bg-yellow-300 hover:shadow-[0_0_15px_rgba(252,238,10,0.7)] transition-all",
        cards: "bg-gray-900 border border-cyan-500/50 p-6 shadow-[0_0_10px_rgba(0,229,255,0.2)]",
        inputs: "bg-black border border-pink-600 text-pink-500 px-4 py-2 font-mono focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,60,0.5)]"
    },
    animation_specs: "Flickering opacities, fast sharp slide-ins, glitch keyframes on hover.",
    asset_recommendations: "Tech/wireframe style SVGs, minimal thin lined icons with glow.",
    tailwind_config: `theme: { extend: { colors: { 'neon-pink': '#FF003C', 'neon-cyan': '#00E5FF' } } }`
};
