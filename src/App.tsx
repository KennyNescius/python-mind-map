import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import { Search, Map as MapIcon } from 'lucide-react';

import CustomNode from './components/CustomNode';
import Sidebar from './components/Sidebar';
import FloatingEdge from './components/FloatingEdge';
import { pythonNodes, pythonEdges, conceptDetails, Concept } from './data/pythonContent';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const getDirection = (source: Node, target: Node) => {
  const dx = target.position.x - source.position.x;
  const dy = target.position.y - source.position.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'bottom' : 'top';
  }
};

const edgeDirections = new Map<string, string>();
const nodeExpandableDirs = new Map<string, Set<string>>();

pythonEdges.forEach(e => {
  const s = pythonNodes.find(n => n.id === e.source);
  const t = pythonNodes.find(n => n.id === e.target);
  if (s && t) {
    const dir = getDirection(s, t);
    edgeDirections.set(e.id, dir);
    
    if (!nodeExpandableDirs.has(e.source)) {
      nodeExpandableDirs.set(e.source, new Set());
    }
    nodeExpandableDirs.get(e.source)!.add(dir);
  }
});

const initialEdges = pythonEdges.map((e) => ({
  ...e,
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#94a3b8',
  },
  style: { strokeWidth: 2, stroke: '#94a3b8' }
}));

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(pythonNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // start is expanded in all directions by default
  const [expandedNodeDirs, setExpandedNodeDirs] = useState<Set<string>>(
    new Set(['start:top', 'start:bottom', 'start:left', 'start:right'])
  );

  const handleToggle = useCallback((nodeId: string, dir: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${nodeId}:${dir}`;
    setExpandedNodeDirs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    let effectiveExpanded = new Set(expandedNodeDirs);
    const matches = new Set<string>();

    if (query.length > 1) {
      pythonNodes.forEach((n) => {
        if (
          String(n.data.title).toLowerCase().includes(query) ||
          String(n.data.desc).toLowerCase().includes(query)
        ) {
          matches.add(n.id);
          let curr = n.id;
          let parentEdge = pythonEdges.find((e) => e.target === curr);
          while (parentEdge) {
            const pId = parentEdge.source;
            const pDir = edgeDirections.get(parentEdge.id);
            if (pDir) {
              effectiveExpanded.add(`${pId}:${pDir}`);
            }
            curr = pId;
            parentEdge = pythonEdges.find((e) => e.target === curr);
          }
        }
      });
    }

    const visibleNodes = new Set<string>();
    const queue = ['start'];
    while (queue.length > 0) {
      const current = queue.shift()!;
      visibleNodes.add(current);
      
      const outgoingEdges = pythonEdges.filter((e) => e.source === current);
      outgoingEdges.forEach(e => {
        const dir = edgeDirections.get(e.id);
        if (dir && effectiveExpanded.has(`${current}:${dir}`)) {
          queue.push(e.target);
        }
      });
    }

    setNodes((nds) => {
      return pythonNodes.map((baseNode) => {
        const existingNode = nds.find((n) => n.id === baseNode.id) || baseNode;
        const isVisible = visibleNodes.has(baseNode.id);
        const expandableDirs = Array.from(nodeExpandableDirs.get(baseNode.id) || []);
        const expandedDirs = expandableDirs.filter(d => effectiveExpanded.has(`${baseNode.id}:${d}`));
        const isMatch = matches.has(baseNode.id);

        let opacity = 1;
        if (query.length > 1 && !isMatch) {
          opacity = 0.3;
        }

        return {
          ...existingNode,
          hidden: !isVisible,
          selected: isMatch ? true : (query.length > 1 ? false : existingNode.selected),
          style: {
            ...existingNode.style,
            opacity,
            transition: 'opacity 0.3s ease',
          },
          data: {
            ...existingNode.data,
            expandableDirs,
            expandedDirs,
            onToggle: handleToggle,
          },
        };
      });
    });

    setEdges((eds) => {
      return initialEdges.map((baseEdge) => {
        const existingEdge = eds.find((e) => e.id === baseEdge.id) || baseEdge;
        const isVisible =
          visibleNodes.has(baseEdge.source) && visibleNodes.has(baseEdge.target);

        return {
          ...existingEdge,
          hidden: !isVisible,
        };
      });
    });
  }, [expandedNodeDirs, searchQuery, handleToggle, setNodes, setEdges]);

  // Handle node click
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const concept = conceptDetails[node.id];
      if (concept) {
        setSelectedConcept(concept);
      }
      
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    },
    [setNodes]
  );

  // Handle search highlighting
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const closeSidebar = useCallback(() => {
    setSelectedConcept(null);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans relative overflow-hidden">
      
      {/* Search Header */}
      <div className="absolute top-4 left-4 z-10 w-[90%] max-w-[320px]">
        <div className="bg-white rounded-2xl shadow-xl flex items-center px-4 py-3 border border-slate-100">
          <MapIcon className="w-6 h-6 text-blue-500 mr-3" />
          <div className="h-6 w-px bg-slate-200 mr-3"></div>
          <div className="flex-1 flex items-center relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-0" />
            <input
              type="text"
              placeholder="Поиск по карте..."
              className="w-full pl-8 pr-2 outline-none text-sm text-slate-700 bg-transparent"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background color="#cbd5e1" variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls className="bg-white shadow-xl rounded-xl border-slate-100" />
        </ReactFlow>
      </div>

      {/* Detail Sidebar */}
      <Sidebar concept={selectedConcept} onClose={closeSidebar} />
    </div>
  );
}

