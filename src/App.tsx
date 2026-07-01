import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  NodeMouseHandler,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import { Search, Map as MapIcon } from 'lucide-react';

import CustomNode from './components/CustomNode';
import Sidebar from './components/Sidebar';
import FloatingEdge from './components/FloatingEdge';
import ThemeToggle from './components/ThemeToggle';
import {
  Concept,
  ContentData,
  edgesOfTree,
  loadContent,
  nodesOfTree,
  toConcepts,
  toFlowEdges,
  toFlowNodes,
  toPythonEdges,
} from './data/content';
import { getTheme } from './data/theme';
import { useFlowLogic } from './hooks/useFlowLogic';

type RevealTarget = { id: string; nonce: number } | null;

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

function initialTree(content: ContentData): string {
  const ids = new Set(content.trees.map((t) => t.id));
  const url = new URLSearchParams(window.location.search).get('tree');
  if (url && ids.has(url)) return url;
  try {
    const s = localStorage.getItem('activeTree');
    if (s && ids.has(s)) return s;
  } catch {
    /* ignore */
  }
  return content.trees[0].id;
}

// One tree's canvas + sidebar. Remounted (via key) when the active tree changes
// so React Flow / expansion state start fresh for the new tree.
function TreeCanvas({
  content,
  treeId,
  theme,
  revealTarget,
  onNavigate,
}: {
  content: ContentData;
  treeId: string;
  theme: string;
  revealTarget: RevealTarget;
  onNavigate: (id: string) => void;
}) {
  const tree = content.trees.find((t) => t.id === treeId) ?? content.trees[0];
  const rawNodes = React.useMemo(() => nodesOfTree(content.nodes, treeId), [content, treeId]);
  const rawEdges = React.useMemo(() => edgesOfTree(content.nodes, content.edges, treeId), [content, treeId]);
  const pythonNodes = React.useMemo(() => toFlowNodes(rawNodes), [rawNodes]);
  const pythonEdges = React.useMemo(() => toPythonEdges(rawEdges), [rawEdges]);
  const initialEdges = React.useMemo(() => toFlowEdges(rawEdges), [rawEdges]);
  const conceptDetails = React.useMemo(() => toConcepts(content.concepts), [content]);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    searchQuery,
    setSearchQuery,
    setNodes,
    revealNode,
  } = useFlowLogic(pythonNodes, pythonEdges, initialEdges, tree.rootId);

  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);

  // Reveal + open a node when navigated to (in-text link / cross-tree jump).
  useEffect(() => {
    if (!revealTarget) return;
    const concept = conceptDetails[revealTarget.id];
    if (concept) setSelectedConcept(concept);
    revealNode(revealTarget.id);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === revealTarget.id })));
    const pos = content.nodes.find((n) => n.id === revealTarget.id)?.position;
    if (pos) {
      setTimeout(() => rfRef.current?.setCenter(pos.x + 110, pos.y + 30, { zoom: 0.9, duration: 600 }), 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealTarget]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const concept = conceptDetails[node.id];
      if (concept) setSelectedConcept(concept);
      setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === node.id })));
    },
    [setNodes, conceptDetails]
  );

  const closeSidebar = useCallback(() => {
    setSelectedConcept(null);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

  return (
    <>
      {/* Search */}
      <div className="absolute top-4 left-4 z-10 w-[90%] max-w-[320px]">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center px-4 py-3 border border-slate-100 dark:border-slate-700">
          <MapIcon className="w-6 h-6 text-blue-500 mr-3" />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 mr-3"></div>
          <div className="flex-1 flex items-center relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-0" />
            <input
              type="text"
              placeholder="Поиск по карте..."
              className="w-full pl-8 pr-2 outline-none text-sm text-slate-700 dark:text-slate-200 bg-transparent placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          onInit={(inst) => (rfRef.current = inst)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background
            color={theme === 'dark' ? '#334155' : '#cbd5e1'}
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
          />
          <Controls className="shadow-xl rounded-xl" />
        </ReactFlow>
      </div>

      {/* Detail Sidebar */}
      <Sidebar concept={selectedConcept} onClose={closeSidebar} onNodeLink={onNavigate} />
    </>
  );
}

function MindMap({ content }: { content: ContentData }) {
  const [theme, setTheme] = useState(getTheme());
  const [activeTreeId, setActiveTreeId] = useState(() => initialTree(content));
  const [revealTarget, setRevealTarget] = useState<RevealTarget>(null);
  const nonceRef = useRef(0);

  const changeTree = useCallback((id: string) => {
    setActiveTreeId(id);
    setRevealTarget(null);
    try {
      localStorage.setItem('activeTree', id);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.set('tree', id);
    history.replaceState(null, '', url.toString());
  }, []);

  // In-text link: switch to the target node's tree (if needed) and reveal it.
  const onNavigate = useCallback(
    (nodeId: string) => {
      const n = content.nodes.find((x) => x.id === nodeId);
      if (!n) return;
      changeTree(n.data.treeId ?? content.trees[0].id);
      setRevealTarget({ id: nodeId, nonce: (nonceRef.current += 1) });
    },
    [content, changeTree]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans relative overflow-hidden">
      {/* Tree switcher + theme */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {content.trees.length > 1 && (
          <select
            value={activeTreeId}
            onChange={(e) => changeTree(e.target.value)}
            title="Тема"
            className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 shadow-xl outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {content.trees.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        )}
        <div className="rounded-xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <ThemeToggle onChange={setTheme} />
        </div>
      </div>

      <TreeCanvas
        key={activeTreeId}
        content={content}
        treeId={activeTreeId}
        theme={theme}
        revealTarget={revealTarget}
        onNavigate={onNavigate}
      />
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
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Ошибка загрузки карты</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Загрузка карты…</p>
      </div>
    );
  }

  return <MindMap content={content} />;
}
