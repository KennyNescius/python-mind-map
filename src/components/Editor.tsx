import React, { useCallback, useEffect, useState } from 'react';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  NodeMouseHandler,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { Download, Eye, EyeOff, Map as MapIcon, Plus, Save, Trash2 } from 'lucide-react';

import CustomNode from './CustomNode';
import MarkdownView from './MarkdownView';
import {
  CATEGORIES,
  ContentData,
  loadContent,
  toFlowNodes,
} from '../data/content';
import { downloadContent, saveContent } from '../data/save';

const nodeTypes = { customNode: CustomNode };

type ConceptMap = Record<string, { title: string; shortDesc: string; content: string }>;

function makeId(): string {
  return `node-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [concepts, setConcepts] = useState<ConceptMap>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'err' | 'busy'; msg: string }>({
    kind: 'idle',
    msg: '',
  });

  useEffect(() => {
    loadContent()
      .then((content) => {
        setNodes(toFlowNodes(content.nodes));
        setEdges(content.edges.map((e) => ({ id: e.id, source: e.source, target: e.target })));
        const cm: ConceptMap = {};
        for (const [id, c] of Object.entries(content.concepts)) cm[id] = { ...c };
        setConcepts(cm);
        setLoaded(true);
      })
      .catch((e) => setStatus({ kind: 'err', msg: e instanceof Error ? e.message : String(e) }));
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (conn: Connection) => {
      setEdges((eds) =>
        addEdge({ ...conn, id: `e-${conn.source}-${conn.target}-${Date.now().toString(36)}` }, eds)
      );
    },
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => setSelectedId(node.id), []);

  const onNodesDelete = useCallback((deleted: Node[]) => {
    setConcepts((prev) => {
      const next = { ...prev };
      for (const n of deleted) delete next[n.id];
      return next;
    });
    setSelectedId((cur) => (deleted.some((n) => n.id === cur) ? null : cur));
  }, []);

  const addNode = useCallback(() => {
    const id = makeId();
    const newNode: Node = {
      id,
      type: 'customNode',
      position: { x: Math.round((Math.random() - 0.5) * 200), y: Math.round((Math.random() - 0.5) * 200) },
      data: { title: 'Новый узел', desc: 'Описание', category: 'core' },
    };
    setNodes((nds) => [...nds, newNode]);
    setConcepts((prev) => ({ ...prev, [id]: { title: 'Новый узел', shortDesc: 'Описание', content: '# Новый узел\n' } }));
    setSelectedId(id);
  }, [setNodes]);

  const updateNodeData = useCallback(
    (id: string, patch: Partial<{ title: string; desc: string; category: string }>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
      );
    },
    [setNodes]
  );

  const updateConcept = useCallback(
    (id: string, patch: Partial<{ title: string; shortDesc: string; content: string }>) => {
      setConcepts((prev) => ({ ...prev, [id]: { ...(prev[id] ?? { title: '', shortDesc: '', content: '' }), ...patch } }));
    },
    []
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    const id = selectedId;
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setConcepts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges]);

  const buildContent = useCallback((): ContentData => {
    return {
      nodes: nodes.map((n) => ({
        id: n.id,
        position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
        data: {
          title: String(n.data.title ?? ''),
          desc: String(n.data.desc ?? ''),
          category: String(n.data.category ?? 'core'),
        },
      })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
      concepts: Object.fromEntries(
        nodes.map((n) => {
          const c = concepts[n.id] ?? { title: String(n.data.title ?? ''), shortDesc: '', content: '' };
          return [n.id, { title: c.title, shortDesc: c.shortDesc, content: c.content }];
        })
      ),
    };
  }, [nodes, edges, concepts]);

  const onSave = useCallback(async () => {
    setStatus({ kind: 'busy', msg: 'Сохранение…' });
    try {
      await saveContent(buildContent());
      setStatus({ kind: 'ok', msg: 'Сохранено. Сайт пересоберётся через минуту.' });
    } catch (e) {
      setStatus({
        kind: 'err',
        msg: `${e instanceof Error ? e.message : String(e)} — используйте «Скачать JSON» как запасной вариант.`,
      });
    }
  }, [buildContent]);

  const onDownload = useCallback(() => downloadContent(buildContent()), [buildContent]);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const selectedConcept = selectedId ? concepts[selectedId] : null;

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans">
      {/* Toolbar */}
      <header className="z-10 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 shadow-sm">
        <MapIcon className="h-5 w-5 text-blue-500" />
        <span className="mr-2 font-semibold text-slate-800">Редактор карты</span>
        <button
          onClick={addNode}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" /> Узел
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Save className="h-4 w-4" /> Сохранить
        </button>
        <button
          onClick={onDownload}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          <Download className="h-4 w-4" /> Скачать JSON
        </button>
        <a
          href="/"
          className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          Открыть карту →
        </a>
      </header>

      {status.msg && (
        <div
          className={`px-4 py-1.5 text-sm ${
            status.kind === 'err'
              ? 'bg-red-50 text-red-700'
              : status.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Canvas */}
        <div className="relative min-w-0 flex-1">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-slate-500">
              Загрузка…
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodesDelete={onNodesDelete}
            onPaneClick={() => setSelectedId(null)}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Background color="#cbd5e1" variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls className="rounded-xl border-slate-100 bg-white shadow-xl" />
          </ReactFlow>
        </div>

        {/* Inspector */}
        <aside className="flex w-[400px] flex-col border-l border-slate-200 bg-white">
          {selectedNode ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 p-3">
                <span className="text-sm font-semibold text-slate-800">Узел</span>
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Удалить
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
                <Field label="ID">
                  <input
                    value={selectedNode.id}
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
                  />
                </Field>

                <Field label="Заголовок">
                  <input
                    value={String(selectedNode.data.title ?? '')}
                    onChange={(e) => {
                      updateNodeData(selectedNode.id, { title: e.target.value });
                      updateConcept(selectedNode.id, { title: e.target.value });
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </Field>

                <Field label="Подпись (под заголовком)">
                  <input
                    value={String(selectedNode.data.desc ?? '')}
                    onChange={(e) => {
                      updateNodeData(selectedNode.id, { desc: e.target.value });
                      updateConcept(selectedNode.id, { shortDesc: e.target.value });
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </Field>

                <Field label="Категория (цвет)">
                  <select
                    value={String(selectedNode.data.category ?? 'core')}
                    onChange={(e) => updateNodeData(selectedNode.id, { category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-500">Контент (Markdown)</label>
                  <button
                    onClick={() => setShowPreview((v) => !v)}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPreview ? 'Скрыть превью' : 'Превью'}
                  </button>
                </div>
                {showPreview ? (
                  <div className="min-h-[200px] rounded-lg border border-slate-200 p-3">
                    <MarkdownView content={selectedConcept?.content ?? ''} />
                  </div>
                ) : (
                  <textarea
                    value={selectedConcept?.content ?? ''}
                    onChange={(e) => updateConcept(selectedNode.id, { content: e.target.value })}
                    className="min-h-[260px] w-full flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-blue-400"
                    placeholder="# Заголовок&#10;Текст в формате Markdown…"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-slate-400">
              Выберите узел, чтобы редактировать его, или добавьте новый.
              <div className="mt-4 space-y-1 text-xs text-slate-400">
                <p>• Перетаскивайте узлы мышью.</p>
                <p>• Тяните от края узла к другому, чтобы создать связь.</p>
                <p>• Выделите узел/связь и нажмите Delete для удаления.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}
