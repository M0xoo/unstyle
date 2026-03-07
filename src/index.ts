import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { THEMES, THEME_KEYS } from "./themes/index.js";

const server = new McpServer({
    name: "unstyle",
    version: "1.1.0",
});

server.tool(
    "get_theme_guidelines",
    "Provide UI design guidelines, rules, color palettes, typography, and component specifications based on a specific theme style to help an LLM generate non-generic, high-quality, beautiful UI code.",
    {
        theme: z.enum(THEME_KEYS).describe("The target UI theme or aesthetic vibe."),
    },
    async ({ theme }) => {
        const guidelines = THEMES[theme as string];
        return {
            content: [{ type: "text", text: JSON.stringify(guidelines, null, 2) }],
        };
    }
);

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("UnStyle Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
