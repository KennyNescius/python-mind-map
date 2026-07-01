import { Edge, MarkerType, Node } from '@xyflow/react';

/**
 * Content lives in /public/content.json (the single source of truth) and is
 * loaded at runtime. This module defines the on-disk shape and the helpers
 * that turn it into the React Flow structures the app renders.
 */

export type Concept = {
  id: string;
  title: string;
  shortDesc: string;
  content: string;
};

/** Categories drive node colors (see CustomNode). Keep in sync with the
 *  keys in CustomNode's categoryColors map. */
export const CATEGORIES = [
  'core',
  'types',
  'collections',
  'control',
  'functions',
  'oop',
  'modules',
  'errors',
  'files',
] as const;

export interface RawNode {
  id: string;
  position: { x: number; y: number };
  data: { title: string; desc: string; category: string; defaultExpanded?: boolean; treeId?: string };
}

export interface RawEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

/** A tree is an independent topic/map with its own root node. */
export interface Tree {
  id: string;
  title: string;
  rootId: string;
}

export interface ContentData {
  nodes: RawNode[];
  edges: RawEdge[];
  concepts: Record<string, { title: string; shortDesc: string; content: string }>;
  trees: Tree[];
}

export const DEFAULT_TREE_ID = 'basics';

function findRootId(nodes: RawNode[], edges: RawEdge[]): string {
  if (nodes.some((n) => n.id === 'start')) return 'start';
  const hasIncoming = new Set(edges.map((e) => e.target));
  return nodes.find((n) => !hasIncoming.has(n.id))?.id ?? nodes[0]?.id ?? 'start';
}

/**
 * Backward-compatible normalization: legacy content without `trees` becomes a
 * single default tree, and every node gets a `treeId`. So old content.json keeps
 * working; the first save from the editor materializes the multi-tree shape.
 */
export function normalizeContent(raw: Partial<ContentData>): ContentData {
  const nodes: RawNode[] = raw.nodes ?? [];
  const edges: RawEdge[] = raw.edges ?? [];
  const concepts = raw.concepts ?? {};
  let trees: Tree[] = Array.isArray(raw.trees) && raw.trees.length ? raw.trees : [];

  if (!trees.length) {
    trees = [{ id: DEFAULT_TREE_ID, title: 'Основы Python', rootId: findRootId(nodes, edges) }];
  }
  const fallbackTree = trees[0].id;
  const normNodes = nodes.map((n) => ({
    ...n,
    data: { ...n.data, treeId: n.data.treeId ?? fallbackTree },
  }));
  return { nodes: normNodes, edges, concepts, trees };
}

/** Nodes belonging to a tree, and the edges whose endpoints are both in it. */
export function nodesOfTree(nodes: RawNode[], treeId: string): RawNode[] {
  return nodes.filter((n) => n.data.treeId === treeId);
}
export function edgesOfTree(nodes: RawNode[], edges: RawEdge[], treeId: string): RawEdge[] {
  const ids = new Set(nodesOfTree(nodes, treeId).map((n) => n.id));
  return edges.filter((e) => ids.has(e.source) && ids.has(e.target));
}

export function toFlowNodes(raw: RawNode[]): Node[] {
  return raw.map((n) => ({
    id: n.id,
    type: 'customNode',
    position: { ...n.position },
    data: { ...n.data },
  }));
}

export function toPythonEdges(raw: RawEdge[]): Edge[] {
  return raw.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    ...(e.animated ? { animated: true } : {}),
  }));
}

export function toFlowEdges(raw: RawEdge[]): Edge[] {
  return toPythonEdges(raw).map((e) => ({
    ...e,
    type: 'floating',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
    style: { strokeWidth: 2, stroke: '#94a3b8' },
  }));
}

export function toConcepts(map: ContentData['concepts']): Record<string, Concept> {
  const out: Record<string, Concept> = {};
  for (const [id, c] of Object.entries(map)) {
    out[id] = { id, ...c };
  }
  return out;
}

export async function loadContent(): Promise<ContentData> {
  const res = await fetch(`${import.meta.env.BASE_URL}content.json`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error(`Не удалось загрузить content.json (HTTP ${res.status})`);
  }
  return normalizeContent(await res.json());
}
