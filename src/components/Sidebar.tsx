import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X } from 'lucide-react';
import { Concept } from '../data/pythonContent';

interface SidebarProps {
  concept: Concept | null;
  onClose: () => void;
}

export default function Sidebar({ concept, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        concept ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 min-h-[64px]">
        <h2 className="text-xl font-bold font-sans text-slate-800">
          {concept?.title || 'Детали'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        {concept ? (
          <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
            <ReactMarkdown
              components={{
                code(props: any) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={oneDark}
                      customStyle={{
                        margin: '1rem 0',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                      }}
                      className="shadow-sm"
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {concept.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-slate-400 text-center mt-10">
            Ничего не выбрано
          </div>
        )}
      </div>
    </div>
  );
}
