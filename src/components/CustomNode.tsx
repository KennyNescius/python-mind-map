import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

// Muted light palette + matching dark variants (easy on the eyes).
const categoryColors = {
  core: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
  types: 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-200',
  collections: 'bg-violet-50 border-violet-200 text-violet-800 dark:bg-violet-950 dark:border-violet-800 dark:text-violet-200',
  control: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200',
  functions: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200',
  oop: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-200',
  modules: 'bg-cyan-50 border-cyan-200 text-cyan-800 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-200',
  errors: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  files: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200',
  default: 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200',
};

const CustomNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  const categoryColor = categoryColors[data.category as keyof typeof categoryColors] || categoryColors.default;
  const { expandableDirs = [], expandedDirs = [], onToggle, title, desc } = data;

  const renderExpandButton = (dir: string) => {
    if (!expandableDirs.includes(dir)) return null;

    const isExpanded = expandedDirs.includes(dir);
    
    // Determine positioning and icon based on direction
    let positionClass = '';
    let Icon = null;

    switch (dir) {
      case 'top':
        positionClass = 'absolute -top-3 left-1/2 transform -translate-x-1/2';
        Icon = isExpanded ? ChevronDown : ChevronUp;
        break;
      case 'bottom':
        positionClass = 'absolute -bottom-3 left-1/2 transform -translate-x-1/2';
        Icon = isExpanded ? ChevronUp : ChevronDown;
        break;
      case 'left':
        positionClass = 'absolute top-1/2 -left-3 transform -translate-y-1/2';
        Icon = isExpanded ? ChevronRight : ChevronLeft;
        break;
      case 'right':
        positionClass = 'absolute top-1/2 -right-3 transform -translate-y-1/2';
        Icon = isExpanded ? ChevronLeft : ChevronRight;
        break;
    }

    return (
      <button
        key={dir}
        onClick={(e) => onToggle?.(id, dir, e)}
        className={`${positionClass} bg-white border border-slate-300 rounded-full p-0.5 shadow-sm hover:bg-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 z-10 transition-colors pointer-events-auto`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-200 min-w-[200px] relative
      ${selected ? 'ring-4 ring-opacity-50 ring-blue-400 dark:ring-blue-500 scale-105 shadow-lg' : 'hover:shadow-md'}
      ${categoryColor}`}
      
      style={{
        boxShadow: selected ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : ''
      }}
    >
      
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0 w-1 h-1 pointer-events-none absolute"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
      <div>
        <div className="font-bold text-sm mb-1">{title}</div>
        <div className="text-xs opacity-80 font-medium">{desc}</div>
      </div>
      
      {['top', 'right', 'bottom', 'left'].map(renderExpandButton)}

      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0 w-1 h-1 pointer-events-none absolute"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};

export default memo(CustomNode);
