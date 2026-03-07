import { ThemeGuidelines } from "../types.js";

export const minimal: ThemeGuidelines = {
    inspiration: "Less but better. Focuses purely on typography, whitespace, and essential content. The un-styled aesthetic.",
    examples: ["read.cv", "apple.com", "notion.so"],
    rules: [
        "Maximum whitespace. Double the padding you think you need.",
        "Extremely limited color palette (usually just black, white, and one muted accent).",
        "No borders if whitespace can separate elements instead.",
        "High typographic contrast (huge sizes vs tiny sizes, thin vs bold)."
    ],
    what_to_use: ["Premium sans or serif fonts", "Grayscale colors", "Massive margins", "Bare minimum structural elements"],
    what_not_to_use: ["Drop shadows", "Background colors on cards", "Gradients", "Unnecessary rules or dividers"],
    color_palette: {
        primary: "#000000",
        background: "#FFFFFF, #FAFAFA",
        text: "#111111, #666666",
        accent: "#E5E5E5"
    },
    typography: {
        headers: "Newsreader, Playfair Display (Serif) or Helvetica Neue, Inter (Sans)",
        body: "Inter, Helvetica Neue, or system strings",
        weights: "300, 400 for structural, 600 for emphasis"
    },
    component_guidelines: {
        buttons: "bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors tracking-wide text-sm",
        cards: "bg-transparent p-0 (use whitespace to define the card rather than backgrounds)",
        inputs: "border-b border-gray-300 bg-transparent px-0 py-2 focus:border-black outline-none transition-colors rounded-none"
    },
    animation_specs: "Very slow, elegant fades (e.g. 300ms ease-in-out opacity).",
    asset_recommendations: "Feather icons (very clean, 1px stroke), real high-quality photography, no illustrations.",
    tailwind_config: `theme: { extend: { spacing: { '18': '4.5rem', '22': '5.5rem' } } }`
};
