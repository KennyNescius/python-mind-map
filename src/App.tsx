import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  NodeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react';
import { Search, Map as MapIcon } from 'lucide-react';

import CustomNode from './components/CustomNode';
import Sidebar from './components/Sidebar';
import FloatingEdge from './components/FloatingEdge';
import {
  Concept,
  ContentData,
  loadContent,
  toConcepts,
  toFlowEdges,
  toFlowNodes,
  toPythonEdges,
} from './data/content';
import { useFlowLogic } from './hooks/useFlowLogic';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

function MindMap({ content }: { content: ContentData }) {
  const pythonNodes = React.useMemo(() => toFlowNodes(content.nodes), [content]);
  const pythonEdges = React.useMemo(() => toPythonEdges(content.edges), [content]);
  const initialEdges = React.useMemo(() => toFlowEdges(content.edges), [content]);
  const conceptDetails = React.useMemo(() => toConcepts(content.concepts), [content]);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    searchQuery,
    setSearchQuery,
    setNodes,
  } = useFlowLogic(pythonNodes, pythonEdges, initialEdges);

  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

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
    [setNodes, conceptDetails]
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

export default function App() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-6 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-800">Ошибка загрузки карты</p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Загрузка карты…</p>
      </div>
    );
  }

  return <MindMap content={content} />;
}
