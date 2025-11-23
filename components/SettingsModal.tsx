
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: { gemini: string; openai: string; anthropic: string };
  setApiKeys: React.Dispatch<React.SetStateAction<{ gemini: string; openai: string; anthropic: string }>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKeys, setApiKeys }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-semibold text-slate-800">App Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg">
             <strong>Note:</strong> Keys are stored in your browser's local state only.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gemini API Key</label>
            <input 
              type="password" 
              value={apiKeys.gemini}
              onChange={(e) => setApiKeys(prev => ({...prev, gemini: e.target.value}))}
              placeholder="AI..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">OpenAI API Key</label>
            <input 
              type="password" 
              value={apiKeys.openai}
              onChange={(e) => setApiKeys(prev => ({...prev, openai: e.target.value}))}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Anthropic API Key</label>
            <input 
              type="password" 
              value={apiKeys.anthropic}
              onChange={(e) => setApiKeys(prev => ({...prev, anthropic: e.target.value}))}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
