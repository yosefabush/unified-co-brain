import React, { useRef } from 'react';
import { DocFile } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Simple ID generation assumption or use random string

// Helper for ID generation since we don't have uuid lib
const generateId = () => Math.random().toString(36).substring(2, 9);

interface DocumentManagerProps {
  documents: DocFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocFile[]>>;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, setDocuments }) => {
  const salesInputRef = useRef<HTMLInputElement>(null);
  const techInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: 'sales_safe' | 'internal_tech') => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: DocFile[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const text = await file.text();
        
        newFiles.push({
          id: generateId(),
          name: file.name,
          content: text,
          category: category
        });
      }

      setDocuments(prev => [...prev, ...newFiles]);
      // Reset input
      if (e.target) e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const salesDocs = documents.filter(d => d.category === 'sales_safe');
  const techDocs = documents.filter(d => d.category === 'internal_tech');

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      
      {/* Sales Safe Folder */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              Folder: Sales Safe
            </h3>
            <p className="text-xs text-indigo-600 mt-1">Public-facing docs</p>
          </div>
          <button 
            onClick={() => salesInputRef.current?.click()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            + Add Files
          </button>
          <input 
            type="file" 
            multiple 
            accept=".txt,.md,.json,.csv"
            ref={salesInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'sales_safe')}
          />
        </div>
        <div className="overflow-y-auto p-2 space-y-2 flex-1">
          {salesDocs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No sales documents loaded</div>
          ) : (
            salesDocs.map(doc => (
              <div key={doc.id} className="group flex items-center justify-between p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center gap-2 overflow-hidden">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                </div>
                <button onClick={() => removeFile(doc.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Internal Tech Folder */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
           <div>
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Folder: Internal Tech
            </h3>
            <p className="text-xs text-emerald-600 mt-1">Confidential R&D docs</p>
          </div>
          <button 
            onClick={() => techInputRef.current?.click()}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            + Add Files
          </button>
          <input 
            type="file" 
            multiple 
            accept=".txt,.md,.json,.js,.ts,.py"
            ref={techInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'internal_tech')}
          />
        </div>
        <div className="overflow-y-auto p-2 space-y-2 flex-1">
          {techDocs.length === 0 ? (
             <div className="text-center py-8 text-slate-400 text-sm">No technical documents loaded</div>
          ) : (
            techDocs.map(doc => (
              <div key={doc.id} className="group flex items-center justify-between p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center gap-2 overflow-hidden">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                </div>
                <button onClick={() => removeFile(doc.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DocumentManager;