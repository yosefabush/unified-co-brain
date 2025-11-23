
import { AppMode, DocFile } from "../types";
import { constructPrompt } from "./promptFactory";

export const askOpenAI = async (
  question: string,
  mode: AppMode,
  allFiles: DocFile[],
  apiKey: string
): Promise<string> => {
  
  // Use the shared factory to get consistent prompts
  const { systemInstruction, userPrompt } = constructPrompt(question, mode, allFiles);

  try {
    if (!apiKey) {
      return "Error: OpenAI API Key is missing. Please add it in Settings.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API request failed");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response generated.";
    
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return `Error: ${error.message || "Unable to process OpenAI request."}`;
  }
};
