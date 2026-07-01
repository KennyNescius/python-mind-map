import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeMouseHandler,
  ReactFlow,
  ReactFlowInstance,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  Map as MapIcon,
  Palette,
  Plus,
  Redo2,
  Save,
  Trash2,
  Undo2,
} from 'lucide-react';

import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import MarkdownView from './MarkdownView';
import ThemeToggle from './ThemeToggle';
import {
  Category,
  colorMapOf,
  ContentData,
  loadContent,
  toFlowEdges,
  toFlowNodes,
  Tree,
} from '../data/content';
import { CategoryColorContext } from './CategoryContext';
import { downloadContent, saveContent } from '../data/save';
import { IdentityUser, loadIdentity, NetlifyIdentity } from '../data/identity';
import { getTheme } from '../data/theme';

const nodeTypes = { customNode: CustomNode };
const edgeTypes = { floating: FloatingEdge };

function makeTreeId(): string {
  return `tree-${Date.now().toString(36)}`;
}

// Same look as the public map; used for newly drawn edges in the editor.
const newEdgeProps = {
  type: 'floating',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
  style: { strokeWidth: 2, stroke: '#94a3b8' },
};

// React Flow nodes for the editor: same as the viewer, but flagged editable so
// CustomNode renders interactive connection handles.
function toEditableNodes(raw: Parameters<typeof toFlowNodes>[0]): Node[] {
  return toFlowNodes(raw).map((n) => ({ ...n, data: { ...n.data, editable: true } }));
}

type ConceptMap = Record<string, { title: string; shortDesc: string; content: string }>;
type Snapshot = { nodes: Node[]; edges: Edge[]; concepts: ConceptMap };

function makeId(): string {
  return `node-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;
}

const HISTORY_LIMIT = 50;

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [concepts, setConcepts] = useState<ConceptMap>({});
  const [trees, setTrees] = useState<Tree[]>([]);
  const [activeTreeId, setActiveTreeId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCats, setShowCats] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [theme, setTheme] = useState(getTheme());
  const [identity, setIdentity] = useState<NetlifyIdentity | null>(null);
  const [user, setUser] = useState<IdentityUser | null>(null);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'err' | 'busy'; msg: string }>({
    kind: 'idle',
    msg: '',
  });

  // Keep refs to current state so history snapshots are always up to date.
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const conceptsRef = useRef(concepts);
  nodesRef.current = nodes;
  edgesRef.current = edges;
  conceptsRef.current = concepts;

  const snapshot = useCallback(
    (): Snapshot => ({
      nodes: structuredClone(nodesRef.current),
      edges: structuredClone(edgesRef.current),
      concepts: structuredClone(conceptsRef.current),
    }),
    []
  );

  const pushHistory = useCallback(() => {
    setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), snapshot()]);
    setFuture([]);
    setDirty(true);
  }, [snapshot]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);

  // For text fields: capture a snapshot on focus, commit it to history on the
  // first change of that editing session.
  const pendingRef = useRef<Snapshot | null>(null);
  const beginFieldEdit = useCallback(() => {
    pendingRef.current = snapshot();
  }, [snapshot]);
  const commitPending = useCallback(() => {
    if (pendingRef.current) {
      const snap = pendingRef.current;
      setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), snap]);
      setFuture([]);
      pendingRef.current = null;
    }
    setDirty(true);
  }, []);

  const applySnapshot = useCallback(
    (s: Snapshot) => {
      setNodes(structuredClone(s.nodes));
      setEdges(structuredClone(s.edges));
      setConcepts(structuredClone(s.concepts));
    },
    [setNodes, setEdges]
  );

  const undo = useCallback(() => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setFuture((f) => [snapshot(), ...f]);
    setPast((p) => p.slice(0, -1));
    applySnapshot(prev);
    setDirty(true);
  }, [past, snapshot, applySnapshot]);

  const redo = useCallback(() => {
    if (!future.length) return;
    const next = future[0];
    setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), snapshot()]);
    setFuture((f) => f.slice(1));
    applySnapshot(next);
    setDirty(true);
  }, [future, snapshot, applySnapshot]);

  useEffect(() => {
    loadContent()
      .then((content) => {
        setNodes(toEditableNodes(content.nodes));
        setEdges(toFlowEdges(content.edges));
        const cm: ConceptMap = {};
        for (const [id, c] of Object.entries(content.concepts)) cm[id] = { ...c };
        setConcepts(cm);
        setTrees(content.trees);
        setCategories(content.categories);
        let initial = content.trees[0]?.id ?? '';
        try {
          const s = localStorage.getItem('activeTree');
          if (s && content.trees.some((t) => t.id === s)) initial = s;
        } catch {
          /* ignore */
        }
        setActiveTreeId(initial);
        setLoaded(true);
      })
      .catch((e) => setStatus({ kind: 'err', msg: e instanceof Error ? e.message : String(e) }));
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadIdentity().then((id) => {
      if (!id) return;
      setIdentity(id);
      setUser(id.currentUser());
      id.on('login', () => {
        id.close();
        // The widget can leave a full-screen overlay that swallows clicks (and a
        // leftover "#" in the URL). A clean reload removes it; the session is
        // already persisted, so the user stays logged in.
        history.replaceState(null, '', window.location.pathname);
        window.location.reload();
      });
      id.on('logout', () => setUser(null));
    });
  }, []);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Undo/redo keyboard shortcuts (ignored while typing in a field).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const onConnect = useCallback(
    (conn: Connection) => {
      if (conn.source === conn.target) return; // no self-loops
      pushHistory();
      setEdges((eds) =>
        addEdge(
          { ...conn, ...newEdgeProps, id: `e-${conn.source}-${conn.target}-${Date.now().toString(36)}` },
          eds
        )
      );
    },
    [setEdges, pushHistory]
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConn: Connection) => {
      if (newConn.source === newConn.target) return;
      pushHistory();
      setEdges((eds) => reconnectEdge(oldEdge, newConn, eds));
    },
    [setEdges, pushHistory]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedId(null);
  }, []);

  // Confirm before any deletion (keyboard or button), then snapshot for undo.
  const onBeforeDelete = useCallback(
    async ({ nodes: dn, edges: de }: { nodes: Node[]; edges: Edge[] }) => {
      const n = dn?.length ?? 0;
      const e = de?.length ?? 0;
      const parts = [];
      if (n) parts.push(`узлов: ${n}`);
      if (e) parts.push(`связей: ${e}`);
      if (!window.confirm(`Удалить ${parts.join(', ')}?`)) return false;
      pushHistory();
      return true;
    },
    [pushHistory]
  );

  const onNodesDelete = useCallback((deleted: Node[]) => {
    setConcepts((prev) => {
      const next = { ...prev };
      for (const nd of deleted) delete next[nd.id];
      return next;
    });
    setSelectedId((cur) => (deleted.some((nd) => nd.id === cur) ? null : cur));
  }, []);

  const addNode = useCallback(() => {
    pushHistory();
    const id = makeId();
    const newNode: Node = {
      id,
      type: 'customNode',
      position: { x: Math.round((Math.random() - 0.5) * 200), y: Math.round((Math.random() - 0.5) * 200) },
      data: {
        title: 'Новый узел',
        desc: 'Описание',
        category: categories[0]?.id ?? 'core',
        editable: true,
        treeId: activeTreeId,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setConcepts((prev) => ({ ...prev, [id]: { title: 'Новый узел', shortDesc: 'Описание', content: '# Новый узел\n' } }));
    setSelectedId(id);
    setSelectedEdgeId(null);
  }, [setNodes, pushHistory, activeTreeId, categories]);

  const changeTree = useCallback((id: string) => {
    setActiveTreeId(id);
    setSelectedId(null);
    setSelectedEdgeId(null);
    try {
      localStorage.setItem('activeTree', id);
    } catch {
      /* ignore */
    }
  }, []);

  const createTree = useCallback(() => {
    const title = window.prompt('Название новой темы:')?.trim();
    if (!title) return;
    pushHistory();
    const treeId = makeTreeId();
    const rootId = makeId();
    const rootNode: Node = {
      id: rootId,
      type: 'customNode',
      position: { x: 0, y: 0 },
      data: {
        title,
        desc: 'Корень темы',
        category: categories[0]?.id ?? 'core',
        editable: true,
        treeId,
        defaultExpanded: true,
      },
    };
    setTrees((ts) => [...ts, { id: treeId, title, rootId }]);
    setNodes((nds) => [...nds, rootNode]);
    setConcepts((prev) => ({ ...prev, [rootId]: { title, shortDesc: 'Корень темы', content: `# ${title}\n` } }));
    changeTree(treeId);
    setSelectedId(rootId);
    setDirty(true);
  }, [pushHistory, setNodes, changeTree, categories]);

  // Fit the view to the newly selected tree.
  useEffect(() => {
    if (!loaded || !activeTreeId) return;
    const t = setTimeout(() => rfRef.current?.fitView({ padding: 0.2, duration: 400 }), 60);
    return () => clearTimeout(t);
  }, [activeTreeId, loaded]);

  const colorMap = React.useMemo(() => colorMapOf(categories), [categories]);

  const addCategory = useCallback(() => {
    const title = window.prompt('Название категории:')?.trim();
    if (!title) return;
    setCategories((cs) => [...cs, { id: `cat-${Date.now().toString(36)}`, title, color: '#64748b' }]);
    setDirty(true);
  }, []);

  const updateCategory = useCallback((id: string, patch: Partial<Category>) => {
    setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setDirty(true);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    if (!window.confirm('Удалить категорию? Узлы этой категории станут серыми.')) return;
    setCategories((cs) => cs.filter((c) => c.id !== id));
    setDirty(true);
  }, []);

  const duplicateSelected = useCallback(() => {
    const src = nodes.find((n) => n.id === selectedId);
    if (!src) return;
    pushHistory();
    const id = makeId();
    const newNode: Node = {
      ...src,
      id,
      selected: false,
      position: { x: src.position.x + 48, y: src.position.y + 48 },
      data: { ...src.data },
    };
    setNodes((nds) => [...nds, newNode]);
    const c = concepts[src.id];
    setConcepts((prev) => ({
      ...prev,
      [id]: c ? { ...c } : { title: String(src.data.title ?? ''), shortDesc: '', content: '' },
    }));
    setSelectedId(id);
    setSelectedEdgeId(null);
  }, [nodes, selectedId, concepts, setNodes, pushHistory]);

  const updateNodeData = useCallback(
    (
      id: string,
      patch: Partial<{ title: string; desc: string; category: string; defaultExpanded: boolean; treeId: string }>
    ) => {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
    },
    [setNodes]
  );

  const updateConcept = useCallback(
    (id: string, patch: Partial<{ title: string; shortDesc: string; content: string }>) => {
      setConcepts((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? { title: '', shortDesc: '', content: '' }), ...patch },
      }));
    },
    []
  );

  // Insert a `[Title](node:id)` link into the content at the caret.
  const insertNodeLink = useCallback(
    (targetId: string) => {
      if (!selectedId) return;
      const target = nodes.find((n) => n.id === targetId);
      if (!target) return;
      const snippet = `[${String(target.data.title ?? targetId)}](node:${targetId})`;
      const ta = textareaRef.current;
      const cur = concepts[selectedId]?.content ?? '';
      const s = ta?.selectionStart ?? cur.length;
      const e = ta?.selectionEnd ?? cur.length;
      const next = cur.slice(0, s) + snippet + cur.slice(e);
      pushHistory();
      updateConcept(selectedId, { content: next });
      setTimeout(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          const caret = s + snippet.length;
          el.setSelectionRange(caret, caret);
        }
      }, 0);
    },
    [selectedId, nodes, concepts, updateConcept, pushHistory]
  );

  const deleteNode = useCallback(
    (id: string) => {
      if (!window.confirm('Удалить этот узел и его связи?')) return;
      pushHistory();
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setConcepts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSelectedId(null);
    },
    [setNodes, setEdges, pushHistory]
  );

  const toggleEdgeAnimated = useCallback(
    (id: string) => {
      pushHistory();
      setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, animated: !e.animated } : e)));
    },
    [setEdges, pushHistory]
  );

  const deleteEdge = useCallback(
    (id: string) => {
      if (!window.confirm('Удалить эту связь?')) return;
      pushHistory();
      setEdges((eds) => eds.filter((e) => e.id !== id));
      setSelectedEdgeId(null);
    },
    [setEdges, pushHistory]
  );

  const updateEdgeEnd = useCallback(
    (id: string, end: 'source' | 'target', nodeId: string) => {
      pushHistory();
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id !== id) return e;
          const next = { ...e, [end]: nodeId };
          return next.source === next.target ? e : next; // ignore self-loops
        })
      );
    },
    [setEdges, pushHistory]
  );

  const reverseEdge = useCallback(
    (id: string) => {
      pushHistory();
      setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, source: e.target, target: e.source } : e)));
    },
    [setEdges, pushHistory]
  );

  const buildContent = useCallback((): ContentData => {
    return {
      nodes: nodes.map((n) => ({
        id: n.id,
        position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
        data: {
          title: String(n.data.title ?? ''),
          desc: String(n.data.desc ?? ''),
          category: String(n.data.category ?? 'core'),
          treeId: String(n.data.treeId ?? trees[0]?.id ?? ''),
          ...(n.data.defaultExpanded ? { defaultExpanded: true } : {}),
        },
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        ...(e.animated ? { animated: true } : {}),
      })),
      concepts: Object.fromEntries(
        nodes.map((n) => {
          const c = concepts[n.id] ?? { title: String(n.data.title ?? ''), shortDesc: '', content: '' };
          return [n.id, { title: c.title, shortDesc: c.shortDesc, content: c.content }];
        })
      ),
      trees,
      categories,
    };
  }, [nodes, edges, concepts, trees, categories]);

  const onSave = useCallback(async () => {
    if (identity && !user) {
      identity.open('login');
      setStatus({ kind: 'err', msg: 'Войдите, чтобы сохранять изменения на сайте.' });
      return;
    }
    setStatus({ kind: 'busy', msg: 'Сохранение…' });
    try {
      await saveContent(buildContent());
      setDirty(false);
      setStatus({ kind: 'ok', msg: 'Сохранено. Сайт пересоберётся через минуту.' });
    } catch (e) {
      setStatus({
        kind: 'err',
        msg: `${e instanceof Error ? e.message : String(e)} — используйте «Скачать JSON» как запасной вариант.`,
      });
    }
  }, [buildContent, identity, user]);

  const onDownload = useCallback(() => downloadContent(buildContent()), [buildContent]);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const selectedConcept = selectedId ? concepts[selectedId] : null;
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId) ?? null;
  const nodeTitle = (id: string) => String(nodes.find((n) => n.id === id)?.data.title ?? id);

  // Show only the active tree on the canvas (nodes of other trees live in the
  // same state but are hidden, so their coordinates don't overlap the view).
  const inActiveTree = (n: Node) => (n.data.treeId ?? activeTreeId) === activeTreeId;
  const activeIds = new Set(nodes.filter(inActiveTree).map((n) => n.id));
  const displayNodes = nodes.map((n) => ({ ...n, hidden: !inActiveTree(n) }));
  const displayEdges = edges.map((e) => ({ ...e, hidden: !(activeIds.has(e.source) && activeIds.has(e.target)) }));

  const toolBtn =
    'flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600';
  const inputCls =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100';

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans dark:bg-slate-900">
      {/* Toolbar */}
      <header className="z-10 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <MapIcon className="h-5 w-5 text-blue-500" />
        <span className="mr-1 font-semibold text-slate-800 dark:text-slate-100">Редактор</span>
        <select
          value={activeTreeId}
          onChange={(e) => changeTree(e.target.value)}
          title="Тема (дерево)"
          className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
        >
          {trees.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <button onClick={createTree} className={toolBtn} title="Создать новую тему">
          <Plus className="h-4 w-4" /> Тема
        </button>
        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-600" />
        <button onClick={addNode} className={toolBtn}>
          <Plus className="h-4 w-4" /> Узел
        </button>
        <button onClick={() => setShowCats((v) => !v)} className={toolBtn} title="Категории и цвета">
          <Palette className="h-4 w-4" /> Категории
        </button>
        <button onClick={undo} disabled={!past.length} className={toolBtn} title="Отменить (Ctrl+Z)">
          <Undo2 className="h-4 w-4" />
        </button>
        <button onClick={redo} disabled={!future.length} className={toolBtn} title="Повторить (Ctrl+Shift+Z)">
          <Redo2 className="h-4 w-4" />
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Save className="h-4 w-4" /> Сохранить
        </button>
        {dirty && <span className="text-xs font-medium text-amber-600 dark:text-amber-400">● не сохранено</span>}
        <button onClick={onDownload} className={toolBtn}>
          <Download className="h-4 w-4" /> Скачать JSON
        </button>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle onChange={setTheme} />
          {identity &&
            (user ? (
              <button
                onClick={() => identity.logout()}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                title={user.email}
              >
                <LogOut className="h-4 w-4" /> Выйти
              </button>
            ) : (
              <button
                onClick={() => identity.open('login')}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <LogIn className="h-4 w-4" /> Войти
              </button>
            ))}
          <a
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            Открыть карту →
          </a>
        </div>
      </header>

      {status.msg && (
        <div
          className={`px-4 py-1.5 text-sm ${
            status.kind === 'err'
              ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
              : status.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {status.msg}
        </div>
      )}

      {showCats && (
        <div className="absolute left-4 top-24 z-30 w-[320px] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Категории</span>
            <button
              onClick={addCategory}
              className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <Plus className="h-3.5 w-3.5" /> Добавить
            </button>
          </div>
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto custom-scrollbar">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <input
                  type="color"
                  value={c.color}
                  onChange={(e) => updateCategory(c.id, { color: e.target.value })}
                  className="h-7 w-8 shrink-0 cursor-pointer rounded border border-slate-200 bg-transparent dark:border-slate-600"
                  title="Цвет"
                />
                <input
                  value={c.title}
                  onChange={(e) => updateCategory(c.id, { title: e.target.value })}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                />
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="shrink-0 rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Canvas */}
        <div className="relative min-w-0 flex-1">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              Загрузка…
            </div>
          )}
          <CategoryColorContext.Provider value={colorMap}>
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onNodeDragStart={pushHistory}
            onBeforeDelete={onBeforeDelete}
            onNodesDelete={onNodesDelete}
            onInit={(inst) => (rfRef.current = inst)}
            onPaneClick={() => {
              setSelectedId(null);
              setSelectedEdgeId(null);
            }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
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
            <Controls className="rounded-xl shadow-xl" />
          </ReactFlow>
          </CategoryColorContext.Provider>
        </div>

        {/* Inspector */}
        <aside className="flex w-[400px] flex-col border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          {selectedEdge ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 p-3 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Связь</span>
                <button
                  onClick={() => deleteEdge(selectedEdge.id)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" /> Удалить
                </button>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <Field label="Из">
                  <select
                    value={selectedEdge.source}
                    onChange={(e) => updateEdgeEnd(selectedEdge.id, 'source', e.target.value)}
                    className={inputCls}
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {String(n.data.title ?? n.id)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="В">
                  <select
                    value={selectedEdge.target}
                    onChange={(e) => updateEdgeEnd(selectedEdge.id, 'target', e.target.value)}
                    className={inputCls}
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {String(n.data.title ?? n.id)}
                      </option>
                    ))}
                  </select>
                </Field>
                <button
                  onClick={() => reverseEdge(selectedEdge.id)}
                  className="flex w-fit items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  ⇄ Развернуть
                </button>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={!!selectedEdge.animated}
                    onChange={() => toggleEdgeAnimated(selectedEdge.id)}
                  />
                  Анимированная связь
                </label>
              </div>
            </div>
          ) : selectedNode ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 p-3 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Узел</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={duplicateSelected}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <Copy className="h-4 w-4" /> Дублировать
                  </button>
                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" /> Удалить
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 custom-scrollbar">
                <Field label="ID">
                  <input
                    value={selectedNode.id}
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500"
                  />
                </Field>

                <Field label="Заголовок">
                  <input
                    value={String(selectedNode.data.title ?? '')}
                    onFocus={beginFieldEdit}
                    onChange={(e) => {
                      commitPending();
                      updateNodeData(selectedNode.id, { title: e.target.value });
                      updateConcept(selectedNode.id, { title: e.target.value });
                    }}
                    className={inputCls}
                  />
                </Field>

                <Field label="Подпись (под заголовком)">
                  <input
                    value={String(selectedNode.data.desc ?? '')}
                    onFocus={beginFieldEdit}
                    onChange={(e) => {
                      commitPending();
                      updateNodeData(selectedNode.id, { desc: e.target.value });
                      updateConcept(selectedNode.id, { shortDesc: e.target.value });
                    }}
                    className={inputCls}
                  />
                </Field>

                <Field label="Категория (цвет)">
                  <select
                    value={String(selectedNode.data.category ?? categories[0]?.id ?? '')}
                    onFocus={beginFieldEdit}
                    onChange={(e) => {
                      commitPending();
                      updateNodeData(selectedNode.id, { category: e.target.value });
                    }}
                    className={inputCls}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </Field>

                {trees.length > 1 && (
                  <Field label="Тема (дерево)">
                    <select
                      value={String(selectedNode.data.treeId ?? activeTreeId)}
                      onChange={(e) => {
                        pushHistory();
                        updateNodeData(selectedNode.id, { treeId: e.target.value });
                      }}
                      className={inputCls}
                    >
                      {trees.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={!!selectedNode.data.defaultExpanded}
                    onChange={(e) => {
                      pushHistory();
                      updateNodeData(selectedNode.id, { defaultExpanded: e.target.checked });
                    }}
                  />
                  Раскрыт по умолчанию на карте
                </label>

                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Контент (Markdown)</label>
                  <div className="flex items-center gap-2">
                    <select
                      value=""
                      title="Вставить ссылку на другой узел"
                      onChange={(e) => {
                        if (e.target.value) insertNodeLink(e.target.value);
                        e.target.value = '';
                      }}
                      className="max-w-[150px] rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    >
                      <option value="">🔗 Ссылка на узел…</option>
                      {nodes
                        .filter((n) => n.id !== selectedNode.id)
                        .map((n) => (
                          <option key={n.id} value={n.id}>
                            {String(n.data.title ?? n.id)}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => setShowPreview((v) => !v)}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showPreview ? 'Скрыть превью' : 'Превью'}
                    </button>
                  </div>
                </div>
                {showPreview ? (
                  <div className="min-h-[200px] rounded-lg border border-slate-200 p-3 dark:border-slate-600">
                    <MarkdownView
                      content={selectedConcept?.content ?? ''}
                      onNodeLink={(id) => {
                        const t = nodes.find((n) => n.id === id)?.data.treeId;
                        if (t && t !== activeTreeId) changeTree(String(t));
                        setSelectedId(id);
                        setSelectedEdgeId(null);
                      }}
                    />
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={selectedConcept?.content ?? ''}
                    onFocus={beginFieldEdit}
                    onChange={(e) => {
                      commitPending();
                      updateConcept(selectedNode.id, { content: e.target.value });
                    }}
                    className="min-h-[260px] w-full flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    placeholder="# Заголовок&#10;Текст в формате Markdown…"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-slate-400 dark:text-slate-500">
              Выберите узел или связь, чтобы редактировать, или добавьте новый узел.
              <div className="mt-4 space-y-1 text-xs text-slate-400 dark:text-slate-500">
                <p>• Перетаскивайте узлы мышью — позиции сохраняются и видны на карте.</p>
                <p>• Тяните от точки на краю узла к другому узлу, чтобы создать связь.</p>
                <p>• Концы готовой связи можно перетащить на другой узел.</p>
                <p>• Связь можно править и в инспекторе (Из/В, развернуть).</p>
                <p>• Выделите узел/связь и нажмите Delete для удаления.</p>
                <p>• Ctrl+Z — отменить, Ctrl+Shift+Z — повторить.</p>
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
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}
