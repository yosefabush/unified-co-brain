
export type AppMode = 'Sales' | 'R&D';
export type AIProvider = 'Gemini' | 'OpenAI' | 'Anthropic';

export interface DocFile {
  id: string;
  name: string;
  content: string;
  category: 'sales_safe' | 'internal_tech';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  modeUsed?: AppMode;
  provider?: AIProvider;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
