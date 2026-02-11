import { GoogleGenAI } from "@google/genai";
import { ArchitectMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const MARKDOWN_RULES = `
OUTPUT RULES:
- ALWAYS provide a primary code block at the end that is a SINGLE-FILE EXECUTABLE (HTML/Tailwind/JS).
- This code block must contain ALL logic needed to render the requested feature instantly in an iframe.
- Use Tailwind CSS CDN for styling in the executable code.
- Use '##' for sections and '###' for subsections.
- Provide a brief Architectural Overview before the code.
`;

export const generateBlueprint = async (mode: ArchitectMode, prompt: string) => {
  const model = "gemini-3-pro-preview";
  
  const systemInstructions = {
    [ArchitectMode.WEB]: `You are LOCOBOT Web Architect. Generate production-ready web interfaces. ${MARKDOWN_RULES}`,
    [ArchitectMode.GAMES]: `You are LOCOBOT Game Engine. Generate browser-based JS/Canvas games. ${MARKDOWN_RULES}`,
    [ArchitectMode.APPS]: `You are LOCOBOT App Forge. Generate high-fidelity mobile-responsive web app mocks. ${MARKDOWN_RULES}`,
    [ArchitectMode.AUTOMATION]: `You are LOCOBOT Neural Automation. Generate dashboard visualization scripts. ${MARKDOWN_RULES}`,
    [ArchitectMode.LEARNING]: `You are LOCOBOT Omni-Mentor. Provide an interactive educational dashboard. ${MARKDOWN_RULES}`
  };

  const response = await ai.models.generateContent({
    model,
    contents: `Project Goal: ${prompt}`,
    config: {
      systemInstruction: systemInstructions[mode],
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  return response.text;
};