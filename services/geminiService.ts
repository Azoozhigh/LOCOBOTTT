import { GoogleGenAI } from "@google/genai";
import { ArchitectMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const MARKDOWN_RULES = `
CRITICAL INSTRUCTIONS:
1. You MUST ALWAYS provide a single, complete, and autonomous HTML file in a code block at the end of your response.
2. This code block MUST be a single-file solution (HTML/CSS/JS/Tailwind CDN).
3. It must be production-ready and aesthetically consistent with the LOCOBOT 2045 brand (Futuristic, Dark Mode, Minimalist).
4. Use '##' for main sections in the blueprint text.
5. Use '###' for features.
6. The preview MUST actually work (e.g., if it's a game, it must be playable with JS).
`;

export const generateBlueprint = async (mode: ArchitectMode, prompt: string) => {
  const model = "gemini-3-pro-preview";
  
  const systemInstructions = {
    [ArchitectMode.WEB]: `You are the LOCOBOT Web Architect. Create full-stack web experiences. ${MARKDOWN_RULES}`,
    [ArchitectMode.GAMES]: `You are the LOCOBOT Game Engine. Create high-performance browser-based games using Canvas or DOM. ${MARKDOWN_RULES}`,
    [ArchitectMode.APPS]: `You are the LOCOBOT App Forge. Create sleek, responsive mobile-first web applications. ${MARKDOWN_RULES}`,
    [ArchitectMode.AUTOMATION]: `You are the LOCOBOT Neural Automation Engine. Create advanced data visualization dashboards. ${MARKDOWN_RULES}`,
    [ArchitectMode.LEARNING]: `You are the LOCOBOT Omni-Mentor. Create interactive, step-by-step learning modules. ${MARKDOWN_RULES}`
  };

  const response = await ai.models.generateContent({
    model,
    contents: `SYNTHESIS REQUEST: ${prompt}`,
    config: {
      systemInstruction: systemInstructions[mode],
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  return response.text;
};