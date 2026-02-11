import { GoogleGenAI } from "@google/genai";
import { ArchitectMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const MARKDOWN_RULES = `
CRITICAL DIRECTIVE:
1. You are LOCOBOT Architect from the year 2045.
2. ALWAYS provide a single, complete HTML code block at the end of your response.
3. This HTML block MUST include ALL necessary CSS (Tailwind via CDN) and JS.
4. It must be a fully functional single-file executable that can run in an iframe.
5. If it's a website, make it responsive and futuristic.
6. If it's a game, ensure it's playable with keyboard or mouse.
7. Use '##' for main sections and '###' for features in your architectural breakdown.
`;

export const generateBlueprint = async (mode: ArchitectMode, prompt: string) => {
  const model = "gemini-3-pro-preview";
  
  const systemInstructions = {
    [ArchitectMode.WEB]: `LOCOBOT Web Synthesis Module: Create high-performance web systems. ${MARKDOWN_RULES}`,
    [ArchitectMode.GAMES]: `LOCOBOT Game Engine: Synthesize AAA browser-based game prototypes. ${MARKDOWN_RULES}`,
    [ArchitectMode.APPS]: `LOCOBOT App Forge: Create sleek, cross-platform app interfaces. ${MARKDOWN_RULES}`,
    [ArchitectMode.AUTOMATION]: `LOCOBOT Neural Automation: Create advanced visualization scripts and tools. ${MARKDOWN_RULES}`,
    [ArchitectMode.LEARNING]: `LOCOBOT Omni-Mentor: Create interactive, gamified learning environments. ${MARKDOWN_RULES}`
  };

  const response = await ai.models.generateContent({
    model,
    contents: `SYNTHESIS TARGET: ${prompt}`,
    config: {
      systemInstruction: systemInstructions[mode],
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  return response.text;
};