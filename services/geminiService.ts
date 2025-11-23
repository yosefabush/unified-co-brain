import { GoogleGenAI } from "@google/genai";
import { AppMode, DocFile } from "../types";
import { constructPrompt } from "./promptFactory";

// Initialize the client
// API Key is strictly from process.env.API_KEY as per guidelines
const getGeminiClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API Key is missing. Please add it in Settings.");
  }
  return new GoogleGenAI({ apiKey: key });
};

/**
 * The core logic for "ask_unified_co_brain" using Gemini
 */
export const askGemini = async (
  question: string,
  mode: AppMode,
  allFiles: DocFile[],
  apiKey?: string
): Promise<string> => {
  
  // Use the shared factory to get consistent prompts
  const { systemInstruction, userPrompt } = constructPrompt(question, mode, allFiles);

  try {
    const ai = getGeminiClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature for more factual retrieval
      }
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Unable to process request. Please check your API key and try again."}`;
  }
  }
;
