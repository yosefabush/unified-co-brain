import { AppMode, DocFile } from "../types";

/**
 * Loads and formats documents based on the allowed categories.
 */
export const loadDocuments = (files: DocFile[], allowedCategories: string[]): string => {
  const filteredFiles = files.filter(f => allowedCategories.includes(f.category));
  
  if (filteredFiles.length === 0) {
    return "No documents available in the selected context.";
  }

  return filteredFiles.map(file => `
---
FILENAME: ${file.name}
CATEGORY: ${file.category === 'sales_safe' ? 'Sales/Public' : 'Internal/Technical'}
CONTENT:
${file.content}
---
`).join('\n');
};

/**
 * Constructs the System Instruction and User Prompt based on the app mode.
 * This ensures consistent behavior across all AI providers (Gemini, OpenAI, Anthropic, etc.).
 */
export const constructPrompt = (
  question: string,
  mode: AppMode,
  allFiles: DocFile[]
) => {
  let contextString = "";
  let systemInstruction = "";

  if (mode === 'Sales') {
    // FOLDER Sales: data/sales_safe ONLY
    contextString = loadDocuments(allFiles, ['sales_safe']);
    
    systemInstruction = `
      You are a Professional Sales Assistant. 
      Your knowledge base is strictly limited to the provided 'Sales/Public' documents.
      
      GUIDELINES:
      1. Be professional, polite, and concise.
      2. Focus on value propositions and benefits.
      3. DO NOT mention internal technical details or code.
      4. If the answer is not in the context, say "I don't have that information available for public release."
    `;
  } else {
    // Mode is 'R&D'
    // FOLDER Sales + FOLDER Internal Tech: data/sales_safe AND data/internal_tech
    contextString = loadDocuments(allFiles, ['sales_safe', 'internal_tech']);

    systemInstruction = `
      You are a Technical Co-Brain for R&D.
      You have access to both public sales data and internal technical documentation.

      GUIDELINES:
      1. Be highly technical and precise.
      2. You MUST reference specific file names when citing information.
      3. Include code snippets from the context if relevant.
      4. Explain the 'why' and 'how' behind features.
    `;
  }

  const userPrompt = `
    CONTEXT DATA:
    ${contextString}

    USER QUESTION:
    ${question}
  `;

  return { systemInstruction, userPrompt };
};
