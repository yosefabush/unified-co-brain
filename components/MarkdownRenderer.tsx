import React from 'react';

// Basic renderer to handle newlines and code blocks roughly without a heavy library
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Code block
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          const code = match ? match[2] : part.slice(3, -3);
          const lang = match ? match[1] : '';
          return (
            <div key={index} className="bg-slate-900 text-slate-50 rounded-md p-4 overflow-x-auto font-mono text-xs my-2">
              {lang && <div className="text-xs text-slate-400 mb-2 border-b border-slate-700 pb-1">{lang}</div>}
              <pre>{code}</pre>
            </div>
          );
        } else {
          // Regular text, handle newlines
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part}
            </span>
          );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;