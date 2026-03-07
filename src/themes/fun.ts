import { ThemeGuidelines } from "../types.js";

export const fun: ThemeGuidelines = {
    inspiration: "Playful, friendly, inviting, and highly engaging. Often used for consumer apps, education, or modern startups that want to stand out from corporate sterility.",
    examples: ["duolingo.com", "discord.com", "linear.app (marketing illustrations)"],
    rules: [
        "Large border radii everywhere (full pills or 16px+ rounded corners).",
        "Soft, colorful, deep drop shadows.",
        "Bouncy, spring-based animations.",
        "Vibrant, saturated primary colors."
    ],
    what_to_use: ["Rounded sans-serif fonts", "Bright gradients", "Chunky, soft buttons", "Emojis and 3D illustrations"],
    what_not_to_use: ["Sharp corners (0px radius)", "Monochrome palettes", "Thin, serious serif fonts", "Strict technical grid lines"],
    color_palette: {
        primary: "#FF4B4B, #20D5D2, #FFB020",
        background: "#F9FAFB, #FFF8F0",
        text: "#1F2937",
        accent: "#8B5CF6"
    },
    typography: {
        headers: "Nunito, Quicksand, or Fredoka One",
        body: "Nunito, Inter, or system-ui",
        weights: "600, 700, 800"
    },
    component_guidelines: {
        buttons: "bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-full px-6 py-3 shadow-[0_8px_0_rgb(109,40,217)] active:translate-y-[4px] active:shadow-[0_4px_0_rgb(109,40,217)] transition-all",
        cards: "bg-white rounded-3xl p-8 shadow-xl shadow-violet-100",
        inputs: "bg-gray-100 rounded-2xl px-4 py-3 border-2 border-transparent focus:border-violet-500 focus:bg-white transition-all outline-none"
    },
    animation_specs: "Bouncy CSS springs or Framer Motion (type: 'spring', stiffness: 400, damping: 10). Hover scales (scale: 1.05).",
    asset_recommendations: "3D emojis, Phosphor icons (duotone or bold), custom whimsical illustrations.",
    tailwind_config: `theme: { extend: { borderRadius: { 'xl': '1rem', '2xl': '1.5rem', '3xl': '2rem' } } }`
};
