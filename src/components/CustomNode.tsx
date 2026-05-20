import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

const categoryColors = {
  core: 'bg-emerald-100 border-emerald-500 text-emerald-900',
  types: 'bg-blue-100 border-blue-500 text-blue-900',
  collections: 'bg-violet-100 border-violet-500 text-violet-900',
  control: 'bg-amber-100 border-amber-500 text-amber-900',
  functions: 'bg-rose-100 border-rose-500 text-rose-900',
  oop: 'bg-indigo-100 border-indigo-500 text-indigo-900',
  modules: 'bg-cyan-100 border-cyan-500 text-cyan-900',
  errors: 'bg-red-100 border-red-500 text-red-900',
  files: 'bg-orange-100 border-orange-500 text-orange-900',
  default: 'bg-slate-100 border-slate-500 text-slate-900',
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
        className={`${positionClass} bg-white border border-slate-300 rounded-full p-0.5 shadow-sm hover:bg-slate-100 text-slate-500 z-10 transition-colors pointer-events-auto`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-200 min-w-[200px] bg-white relative
      ${selected ? 'ring-4 ring-opacity-50 ring-blue-400 scale-105 shadow-lg' : 'hover:shadow-md'} 
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
