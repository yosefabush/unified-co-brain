
import Anthropic from "@anthropic-ai/sdk";
import { AppMode, DocFile } from "../types";
import { constructPrompt } from "./promptFactory";

export const askClaude = async (
  question: string,
  mode: AppMode,
  allFiles: DocFile[],
  apiKey: string
): Promise<string> => {
  
  // Use the shared factory to get consistent prompts
  const { systemInstruction, userPrompt } = constructPrompt(question, mode, allFiles);

  try {
    if (!apiKey) {
      return "Error: Anthropic API Key is missing. Please add it in Settings.";
    }

    // Initialize Anthropic client with dangerouslyAllowBrowser option
    const anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemInstruction,
      messages: [
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    });

    // Extract text from the first content block
    if (message.content && message.content.length > 0 && message.content[0].type === 'text') {
      return message.content[0].text;
    }
    
    return "No text response received from Claude.";
    
  } catch (error: any) {
    console.error("Anthropic API Error:", error);
    return `Error: ${error.message || "Unable to process Anthropic request."}`;
  }
};
