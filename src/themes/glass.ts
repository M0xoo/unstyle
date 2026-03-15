import { ThemeGuidelines } from "../types.js";

export const glass: ThemeGuidelines = {
    inspiration: "Modern glassmorphism: translucent layers, soft depth, and ambient color gradients with polished, premium feel.",
    examples: ["apple.com (visionOS materials)", "stripe.com (hero treatments)", "framer.com"],
    design_principles: [
        "Depth through layered translucency and blur, not heavy shadows.",
        "Use a disciplined material system: base, elevated, modal.",
        "Keep text and controls highly legible against dynamic backgrounds.",
        "Motion should reinforce depth changes between layers."
    ],
    rules: [
        "Use frosted panels with consistent blur values (8-24px).",
        "Pair translucent surfaces with subtle 1px inner/outer highlights.",
        "Maintain clear z-index hierarchy for each layer type.",
        "Limit simultaneous gradients to avoid muddy color mixtures.",
        "Interactive elements need distinct hover/focus from base glass.",
        "Keep corner radii consistent across related components."
    ],
    what_to_use: ["Backdrop blur", "Semi-transparent surfaces", "Soft gradients", "Subtle specular highlights"],
    what_not_to_use: ["Opaque heavy cards everywhere", "High-noise textures", "Harsh black borders", "Tiny low-contrast labels"],
    accessibility: [
        "Always test text contrast against the worst-case background beneath glass.",
        "Provide opaque fallback surfaces for critical content blocks.",
        "Focus rings must remain visible on blurred/translucent layers.",
        "Respect reduced-transparency preferences where possible."
    ],
    color_palette: {
        primary: "#7C8CFF, #5DE2E7",
        background: "#0B1020, #131A2E",
        surface: "rgba(255,255,255,0.14), rgba(255,255,255,0.08)",
        text: "#F8FAFF, #C7D2F0",
        border: "rgba(255,255,255,0.28)",
        accent: "#A78BFA"
    },
    typography: {
        headers: "Inter, Satoshi, or SF Pro Display",
        body: "Inter, SF Pro Text, system-ui",
        weights: "400 body, 500 controls, 600 headlines"
    },
    component_guidelines: {
        buttons: "bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl px-4 py-2 backdrop-blur-md transition-colors",
        cards: "bg-white/10 border border-white/25 rounded-2xl p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        inputs: "bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-violet-300/60"
    },
    animation_specs: "Use material-like transitions: opacity + blur + scale (150-220ms, ease-out). Avoid exaggerated spring bounce.",
    asset_recommendations: "Soft gradient blobs, thin outlined icons, subtle grain overlays (<4% opacity).",
    tailwind_config: `theme: { extend: { backdropBlur: { xs: '2px' }, boxShadow: { glass: '0 10px 30px rgba(0,0,0,0.25)' } } }`
};
