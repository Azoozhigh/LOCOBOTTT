import { GoogleGenAI } from "@google/genai";
import { ArchitectMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const MARKDOWN_RULES = `
OUTPUT RULES:
- Always use high-quality, valid Markdown.
- Use '##' for main sections (e.g., ## Architectural Overview).
- Use '###' for subsections.
- Wrap all code in triple backticks with language identifiers (e.g., \`\`\`typescript).
- For file structures, use a code block with 'text' language.
- Ensure clear spacing between paragraphs and sections.
- Use bullet points for features and technical requirements.
- DO NOT use bold text for every single sentence; use it for emphasis only.
`;

export const generateBlueprint = async (mode: ArchitectMode, prompt: string) => {
  const model = "gemini-3-pro-preview";
  
  const systemInstructions = {
    [ArchitectMode.WEB]: `You are LOCOBOT Web Architect. Generate production-ready Next.js 14, Tailwind CSS, and Supabase code structures. Focus on performance, clean folder structures, and SEO. ${MARKDOWN_RULES}`,
    [ArchitectMode.GAMES]: `You are LOCOBOT Game Engine. Generate Unity/C# or Unreal/C++ high-fidelity multiplayer game scaffolding. Focus on physics, real-time networking, and rendering optimizations. ${MARKDOWN_RULES}`,
    [ArchitectMode.APPS]: `You are LOCOBOT App Forge. Generate React Native or Flutter cross-platform mobile app code. Focus on native performance, navigation, and store compliance. ${MARKDOWN_RULES}`,
    [ArchitectMode.AUTOMATION]: `You are LOCOBOT Neural Automation. Generate Python or Node.js scripts for local automation (file management, API integration, Telegram/WhatsApp control). ${MARKDOWN_RULES}`,
    [ArchitectMode.LEARNING]: `You are LOCOBOT Omni-Mentor. Provide a step-by-step interactive tutorial on how to build the requested system. Explain the 'why' behind the architecture. ${MARKDOWN_RULES}`
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

export const generateModularComponent = async (description: string) => {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Generate a single modular, highly-documented code file for: ${description}. Use Markdown.`,
    config: {
      temperature: 0.2
    }
  });
  return response.text;
};