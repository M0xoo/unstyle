import { ThemeGuidelines } from "../types.js";

export const brutal: ThemeGuidelines = {
    inspiration: "Brutalism focuses on raw, unpolished, and structural elements. It's an intentional departure from modern standard web design, emphasizing huge typography, high contrast, and a 'rough' feel.",
    examples: ["neo-brutalism.com", "gumroad.com", "figma.com (brand pages)"],
    rules: [
        "No rounded corners on structural elements unless exaggerated (e.g., 9999px or 0px).",
        "Thick, solid, black borders on almost everything.",
        "Hard, offset shadow blocks instead of soft drop shadows.",
        "Maximal contrast, jarring color combinations are acceptable."
    ],
    what_to_use: ["Monospaced fonts", "Huge sans-serif headers", "Solid colors", "Thick borders (border-4 or border-8)"],
    what_not_to_use: ["Gradients", "Soft shadows", "Translucency/opacity", "Delicate, thin font weights"],
    color_palette: {
        primary: "#FF3366, #00C4FF, #FFE800",
        background: "#FFFFFF, #EBEBEB",
        text: "#000000",
        accent: "#000000"
    },
    typography: {
        headers: "Syncopate, Space Mono, or heavily weighted standard sans (Inter Black)",
        body: "Space Mono, Courier New, or standard sans",
        weights: "400 for regular, 800+ for headers"
    },
    component_guidelines: {
        buttons: "border-4 border-black bg-yellow-400 text-black font-bold uppercase py-3 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all",
        cards: "border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        inputs: "border-4 border-black bg-white p-3 focus:outline-none focus:bg-pink-200"
    },
    animation_specs: "instant, snappy, no easing. Use transform translations for click states.",
    asset_recommendations: "Pixel art icons, solid stark SVGs with thick stroke widths.",
    tailwind_config: `theme: { extend: { boxShadow: { 'brutal': '4px 4px 0px 0px rgba(0,0,0,1)', 'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)' } } }`
};
