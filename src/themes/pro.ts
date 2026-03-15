import { ThemeGuidelines } from "../types.js";

export const pro: ThemeGuidelines = {
    inspiration: "Professional, enterprise-grade, highly polished 'dev-tool' aesthetic. It feels premium, understated, and incredibly fast.",
    examples: ["linear.app", "stripe.com", "vercel.com"],
    design_principles: [
        "Clarity and deference: UI should support content, not compete with it.",
        "Tight visual rhythm via consistent spacing and alignment.",
        "Design token mindset: colors, radius, and shadows must be reusable primitives.",
        "Polish through subtlety: depth and motion are restrained and purposeful."
    ],
    rules: [
        "Extremely subtle borders (often just 1px with low opacity white/black).",
        "Lots of dark mode variations with very subtle mesh gradients or noise backgrounds.",
        "Muted text colors for secondary information (text-gray-400 or text-zinc-500).",
        "Perfect alignment and tight, consistent spatial systems (4px/8px grid).",
        "Limit accent colors to one primary and one semantic highlight.",
        "Use predictable component states: default, hover, focus, disabled, error."
    ],
    what_to_use: ["Inter or Geist typography", "Subtle inset shadows", "Glassmorphic overlays for modals/menus", "Framer motion for buttery smooth transitions"],
    what_not_to_use: ["Bright, saturated backgrounds", "Thick borders", "Exaggerated corner radii", "Comic fonts"],
    accessibility: [
        "Default text contrast should meet 4.5:1 even in dark mode.",
        "Placeholder text should remain readable; avoid ultra-low contrast grays.",
        "Keep focus outlines visible with >=3:1 contrast against surroundings.",
        "Respect reduced-motion preferences by disabling spring-heavy transitions."
    ],
    color_palette: {
        primary: "#5E6AD2 (Linear purple) or #0070F3 (Vercel blue)",
        background: "#000000, #0A0A0A, #111111",
        surface: "#1A1A1A, #222222",
        text: "#EDEDED, #A1A1AA",
        border: "rgba(255,255,255,0.1)",
        accent: "#FFFFFF"
    },
    typography: {
        headers: "Inter, Geist, SF Pro Display",
        body: "Inter, Geist, SF Pro Text",
        weights: "400, 500, 600. Avoid 800+ unless very specific."
    },
    component_guidelines: {
        buttons: "bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-md px-4 py-2 text-sm font-medium transition-colors ring-1 ring-inset ring-white/10",
        cards: "bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-md",
        inputs: "bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
    },
    animation_specs: "Subtle fade-ins, spring physics for modals (stiffness 300, damping 30), 150ms ease-out color transitions.",
    asset_recommendations: "Lucide icons (1.5px stroke), Phosphor icons (light). Keep them small and subtle.",
    tailwind_config: `theme: { extend: { colors: { border: 'hsl(var(--border))', background: 'hsl(var(--background))' }, borderRadius: { 'pro': '0.5rem' } } }`
};
