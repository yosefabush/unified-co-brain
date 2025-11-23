
import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ChatState, DocFile, Message, AIProvider } from './types';
import DocumentManager from './components/DocumentManager';
import SettingsModal from './components/SettingsModal';
import { askGemini } from './services/geminiService';
import { askOpenAI } from './services/openAiService';
import { askClaude } from './services/anthropicService';
import MarkdownRenderer from './components/MarkdownRenderer';

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function App() {
  const [documents, setDocuments] = useState<DocFile[]>([]);
  const [mode, setMode] = useState<AppMode>('Sales');
  const [provider, setProvider] = useState<AIProvider>('Gemini');
  
  // State for keys not provided by the environment
  const [apiKeys, setApiKeys] = useState({
    gemini: process.env.GEMINI_API_KEY || process.env.API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || ''
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: 'welcome',
        role: 'model',
        text: 'Hello! I am your Unified Co-Brain. Upload documents to the left to get started. Switch modes to change my persona and access level.',
        timestamp: Date.now(),
        modeUsed: 'Sales',
        provider: 'Gemini'
      }
    ],
    isLoading: false
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatState.isLoading) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true
    }));
    setInput('');

    // Call AI based on Provider
    let responseText = "";
    try {
      if (provider === 'Gemini') {
        responseText = await askGemini(userMsg.text, mode, documents, apiKeys.gemini);
      } else if (provider === 'OpenAI') {
        responseText = await askOpenAI(userMsg.text, mode, documents, apiKeys.openai);
      } else if (provider === 'Anthropic') {
        responseText = await askClaude(userMsg.text, mode, documents, apiKeys.anthropic);
      }
    } catch (err) {
      responseText = "Error processing request.";
    }

    const botMsg: Message = {
      id: generateId(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
      modeUsed: mode,
      provider: provider
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, botMsg],
      isLoading: false
    }));
  };

  return (
    <div className="flex h-screen w-full bg-slate-100">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        apiKeys={apiKeys} 
        setApiKeys={setApiKeys}
      />
      
      {/* Sidebar: Data Sources */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg shadow-sm flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              Co-Brain
            </h1>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              title="API Key Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-1">Knowledge Context Manager</p>
          
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">AI Provider</label>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2"
            >
              <option value="Gemini">Google Gemini (2.5 flash)</option>
              <option value="OpenAI">OpenAI (GPT-4o)</option>
              <option value="Anthropic">Anthropic (Claude 4.5)</option>
            </select>
          </div>
        </div>
        
        <DocumentManager documents={documents} setDocuments={setDocuments} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header / Mode Switcher */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Active Mode:</span>
            <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => setMode('Sales')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === 'Sales' 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sales (Safe)
              </button>
              <button
                onClick={() => setMode('R&D')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === 'R&D' 
                    ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                R&D (Full Access)
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            {documents.length} files loaded • {provider}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatState.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3xl rounded-2xl px-6 py-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : msg.modeUsed === 'R&D'
                    ? 'bg-slate-900 border border-slate-700 text-slate-100 rounded-bl-none font-mono'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      msg.modeUsed === 'Sales' ? 'text-indigo-500' : 'text-emerald-400'
                    }`}>
                      {msg.modeUsed} Response
                    </span>
                    <span className={`text-xs ${msg.modeUsed === 'R&D' ? 'text-slate-600' : 'text-slate-300'}`}>•</span>
                    <span className={`text-xs font-medium ${msg.modeUsed === 'R&D' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {msg.provider || 'Gemini'}
                    </span>
                  </div>
                )}
                {msg.role === 'user' ? (
                  <p>{msg.text}</p>
                ) : (
                  <MarkdownRenderer content={msg.text} />
                )}
              </div>
            </div>
          ))}
          {chatState.isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-6 py-4 shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${provider} a question (${mode} mode)...`}
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || chatState.isLoading}
              className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI can make mistakes. Please verify important information.
          </p>
        </div>

      </div>
    </div>
  );
}
