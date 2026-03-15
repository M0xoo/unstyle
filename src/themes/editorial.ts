import { ThemeGuidelines } from "../types.js";

export const editorial: ThemeGuidelines = {
    inspiration: "Magazine-like product storytelling: dramatic typography, strong rhythm, high contrast imagery, and elegant restraint.",
    examples: ["a24films.com", "wsj.com", "airbnb.design"],
    design_principles: [
        "Typography is the main visual system and establishes hierarchy first.",
        "Use asymmetrical layouts with deliberate alignment anchors.",
        "Balance dense editorial sections with generous white space breaks.",
        "Treat imagery as narrative blocks, not decorative filler."
    ],
    rules: [
        "Pair one serif display family with one neutral sans body family.",
        "Use large heading scale jumps (e.g., 16/20/28/40/64).",
        "Keep palette mostly neutral with one restrained accent.",
        "Use subtle dividers and baseline-aligned spacing.",
        "Buttons should feel quiet and secondary to content.",
        "Card surfaces stay flat; depth should come from hierarchy, not shadows."
    ],
    what_to_use: ["Editorial serif headlines", "Pull quotes", "Asymmetric grids", "Long-form readable measure (60-75 chars)"],
    what_not_to_use: ["Overly bright gradients", "Chunky shadows", "Over-rounded controls", "Dense dashboard-like clutter"],
    accessibility: [
        "Body text should stay >=16px with 1.5+ line height for readability.",
        "Contrast for paragraphs must meet 4.5:1 on all backgrounds.",
        "Avoid justified body copy to prevent uneven spacing rivers.",
        "Ensure links are recognizable without relying only on color."
    ],
    color_palette: {
        primary: "#1A1A1A",
        background: "#F7F5F2, #FFFFFF",
        surface: "#EFEAE3",
        text: "#111111, #4B4B4B",
        border: "#D9D2C8",
        accent: "#8C3B2A"
    },
    typography: {
        headers: "Canela, Playfair Display, or Source Serif 4",
        body: "Inter, Source Sans 3, or system-ui",
        weights: "400 body, 500/600 subheads, 700 display emphasis"
    },
    component_guidelines: {
        buttons: "border border-stone-400 text-stone-900 px-5 py-2 text-sm tracking-wide uppercase hover:bg-stone-100 transition-colors rounded-none",
        cards: "bg-transparent border-b border-stone-300 pb-6",
        inputs: "bg-transparent border-b border-stone-400 px-0 py-2 focus:outline-none focus:border-stone-900 rounded-none"
    },
    animation_specs: "Use restrained fades and gentle translateY transitions (120-220ms ease-out). Avoid bouncy motion.",
    asset_recommendations: "High-quality monochrome or duotone photography, thin line icons, and typographic ornaments used sparingly.",
    tailwind_config: `theme: { extend: { fontFamily: { display: ['"Playfair Display"', 'serif'], body: ['Inter', 'system-ui', 'sans-serif'] }, maxWidth: { prose: '72ch' } } }`
};
