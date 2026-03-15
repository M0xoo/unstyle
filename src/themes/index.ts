import { brutal } from "./brutal.js";
import { pro } from "./pro.js";
import { fun } from "./fun.js";
import { cyberpunk } from "./cyberpunk.js";
import { minimal } from "./minimal.js";
import { editorial } from "./editorial.js";
import { glass } from "./glass.js";
import { nature } from "./nature.js";
import { ThemeGuidelines } from "../types.js";

export const THEMES: Record<string, ThemeGuidelines> = {
    brutal,
    pro,
    fun,
    cyberpunk,
    minimal,
    editorial,
    glass,
    nature,
};

export const THEME_KEYS = Object.keys(THEMES) as [keyof typeof THEMES, ...Array<keyof typeof THEMES>];
