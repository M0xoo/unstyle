import { ThemeGuidelines } from "../types.js";

export const nature: ThemeGuidelines = {
    inspiration: "Organic, calm, and grounded interfaces inspired by natural materials, outdoor products, and mindful apps.",
    examples: ["patagonia.com", "headspace.com", "alltrails.com"],
    design_principles: [
        "Warm neutrality with selective earthy accents.",
        "Rounded and organic forms that feel tactile and approachable.",
        "Visual calm: moderate density, clear breathing room, soft contrast.",
        "Content tone should feel supportive, human, and trustworthy."
    ],
    rules: [
        "Base palette should use off-whites, moss/forest greens, and warm browns.",
        "Prefer soft corners and gentle component outlines over sharp hard lines.",
        "Use texture or illustration sparingly to avoid visual clutter.",
        "Iconography should be simple and nature-inspired where relevant.",
        "Favor vertical rhythm and generous spacing for calm reading flow.",
        "Micro-interactions should be subtle and low-energy."
    ],
    what_to_use: ["Earth-tone palettes", "Organic rounded shapes", "Friendly sans fonts", "Natural photography"],
    what_not_to_use: ["Neon accents", "Hard black-heavy UIs", "Aggressive motion", "Overly technical visual metaphors"],
    accessibility: [
        "Avoid low-contrast green-on-green combinations for text.",
        "Ensure CTA buttons stand out from muted backgrounds at 3:1+.",
        "Support keyboard navigation with visible focus indicators.",
        "Use descriptive labels and helper text for all form fields."
    ],
    color_palette: {
        primary: "#2F6B4F",
        background: "#F6F4EE, #EDE8DD",
        surface: "#FFFFFF, #F3EFE4",
        text: "#1F2A1F, #4D5A4D",
        border: "#D9D2C3",
        accent: "#C17A3F"
    },
    typography: {
        headers: "Manrope, Avenir Next, or DM Sans",
        body: "Inter, Source Sans 3, or system-ui",
        weights: "400 body, 500 labels, 600 headings"
    },
    component_guidelines: {
        buttons: "bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-5 py-2.5 font-medium transition-colors",
        cards: "bg-amber-50/60 border border-stone-200 rounded-2xl p-6",
        inputs: "bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
    },
    animation_specs: "Slow and subtle transitions (180-260ms). Prefer fades and tiny translations (2-4px).",
    asset_recommendations: "Nature photography, hand-drawn accent icons, soft grain textures, earthy illustrations.",
    tailwind_config: `theme: { extend: { colors: { moss: '#2F6B4F', earth: '#C17A3F', sand: '#F6F4EE' }, borderRadius: { organic: '1rem' } } }`
};
