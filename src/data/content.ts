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
  data: { title: string; desc: string; category: string; defaultExpanded?: boolean };
}

export interface RawEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface ContentData {
  nodes: RawNode[];
  edges: RawEdge[];
  concepts: Record<string, { title: string; shortDesc: string; content: string }>;
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
  return res.json() as Promise<ContentData>;
}
