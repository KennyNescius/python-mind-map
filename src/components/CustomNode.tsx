import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryColors } from './CategoryContext';

const FALLBACK_COLOR = '#64748b'; // slate-500

const CustomNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  const colors = useCategoryColors();
  const { expandableDirs = [], expandedDirs = [], onToggle, title, desc, editable } = data;
  // Category color drives a subtle tinted fill + solid border; text stays a
  // neutral, always-readable color (theme-based) rather than the accent.
  const accent = colors[data.category as string] ?? FALLBACK_COLOR;

  // In the editor every side gets an interactive handle so connections can be
  // drawn/reconnected in any direction (paired with ConnectionMode.Loose).
  const sidePositions: [string, Position][] = [
    ['top', Position.Top],
    ['right', Position.Right],
    ['bottom', Position.Bottom],
    ['left', Position.Left],
  ];

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
      className={`px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-200 min-w-[200px] relative text-slate-800 dark:text-slate-100
      ${selected ? 'ring-4 ring-opacity-50 ring-blue-400 dark:ring-blue-500 scale-105 shadow-lg' : 'hover:shadow-md'}`}
      style={{
        backgroundColor: `${accent}1f`,
        borderColor: accent,
        boxShadow: selected ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : '',
      }}
    >
      
      {editable ? (
        // Source + target handle on every side; the source dot is visible, the
        // target overlaps it invisibly so connections can land from any side.
        sidePositions.map(([side, pos]) => (
          <React.Fragment key={side}>
            <Handle
              id={`t-${side}`}
              type="target"
              position={pos}
              className="!h-3 !w-3 !min-h-0 !min-w-0 !border-0 !bg-transparent pointer-events-auto"
            />
            <Handle
              id={`s-${side}`}
              type="source"
              position={pos}
              className="!h-2.5 !w-2.5 !min-h-0 !min-w-0 rounded-full !border-2 !border-white !bg-slate-400 pointer-events-auto dark:!border-slate-800 dark:!bg-slate-500"
            />
          </React.Fragment>
        ))
      ) : (
        <Handle
          type="target"
          position={Position.Top}
          className="opacity-0 w-1 h-1 pointer-events-none absolute"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      )}

      <div>
        <div className="font-bold text-sm mb-1">{title}</div>
        <div className="text-xs opacity-80 font-medium">{desc}</div>
      </div>

      {['top', 'right', 'bottom', 'left'].map(renderExpandButton)}

      {!editable && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="opacity-0 w-1 h-1 pointer-events-none absolute"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      )}
    </div>
  );
};

export default memo(CustomNode);
