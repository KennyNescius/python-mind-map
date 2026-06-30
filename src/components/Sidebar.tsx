import React from 'react';
import { X } from 'lucide-react';
import { Concept } from '../data/content';
import MarkdownView from './MarkdownView';

interface SidebarProps {
  concept: Concept | null;
  onClose: () => void;
}

export default function Sidebar({ concept, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        concept ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700 min-h-[64px]">
        <h2 className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100">
          {concept?.title || 'Детали'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        {concept ? (
          <MarkdownView content={concept.content} />
        ) : (
          <div className="text-slate-400 text-center mt-10">Ничего не выбрано</div>
        )}
      </div>
    </div>
  );
}
