export interface ThemeGuidelines {
    inspiration: string;
    examples: string[];
    design_principles: string[];
    rules: string[];
    what_to_use: string[];
    what_not_to_use: string[];
    accessibility: string[];
    color_palette: {
        primary: string;
        background: string;
        text: string;
        accent: string;
        surface?: string;
        border?: string;
    };
    typography: {
        headers: string;
        body: string;
        weights: string;
    };
    component_guidelines: {
        buttons: string;
        cards: string;
        inputs: string;
    };
    animation_specs: string;
    asset_recommendations: string;
    tailwind_config: string;
}
