import { useState, useMemo, useCallback, useEffect } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';

const getDirection = (source: Node, target: Node) => {
  const dx = target.position.x - source.position.x;
  const dy = target.position.y - source.position.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'bottom' : 'top';
  }
};

// Initial expanded directions: derived from nodes flagged data.defaultExpanded
// (plus 'start'). For each such node we open the directions toward its children
// AND the path from 'start' down to it, so the branch is actually visible.
function computeInitialExpanded(nodes: Node[], edges: Edge[], rootId: string): Set<string> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const expanded = new Set<string>();

  const openChildren = (nodeId: string) => {
    edges
      .filter((e) => e.source === nodeId)
      .forEach((e) => {
        const s = byId.get(e.source);
        const t = byId.get(e.target);
        if (s && t) expanded.add(`${nodeId}:${getDirection(s, t)}`);
      });
  };

  const openPathFromStart = (nodeId: string) => {
    let curr = nodeId;
    let guard = 0;
    let parentEdge = edges.find((e) => e.target === curr);
    while (parentEdge && guard++ < nodes.length) {
      const s = byId.get(parentEdge.source);
      const t = byId.get(parentEdge.target);
      if (s && t) expanded.add(`${parentEdge.source}:${getDirection(s, t)}`);
      curr = parentEdge.source;
      parentEdge = edges.find((e) => e.target === curr);
    }
  };

  const flagged = nodes.filter((n) => n.data?.defaultExpanded);
  const roots = flagged.length ? flagged.map((n) => n.id) : [rootId];
  // The tree root always opens its own children so the map is never empty.
  openChildren(rootId);
  for (const id of roots) {
    openChildren(id);
    openPathFromStart(id);
  }
  return expanded;
}

// Directions (`parent:dir`) along the path from 'start' down to a node, so
// expanding them makes that node visible.
function pathDirsToNode(nodeId: string, nodes: Node[], edges: Edge[]): string[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const dirs: string[] = [];
  let curr = nodeId;
  let guard = 0;
  let parentEdge = edges.find((e) => e.target === curr);
  while (parentEdge && guard++ < nodes.length) {
    const s = byId.get(parentEdge.source);
    const t = byId.get(parentEdge.target);
    if (s && t) dirs.push(`${parentEdge.source}:${getDirection(s, t)}`);
    curr = parentEdge.source;
    parentEdge = edges.find((e) => e.target === curr);
  }
  return dirs;
}

export function useFlowLogic(
  initialPythonNodes: Node[],
  initialPythonEdges: Edge[],
  initialFlowEdges: Edge[],
  rootId: string = 'start'
) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialPythonNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlowEdges);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initially expanded directions come from nodes flagged defaultExpanded
  // (fallback: just 'start').
  const [expandedNodeDirs, setExpandedNodeDirs] = useState<Set<string>>(() =>
    computeInitialExpanded(initialPythonNodes, initialPythonEdges, rootId)
  );

  // Compute directions and expandable directions only once when nodes/edges are initialized
  const { edgeDirections, nodeExpandableDirs } = useMemo(() => {
    const directions = new Map<string, string>();
    const expandableDirs = new Map<string, Set<string>>();

    initialPythonEdges.forEach(e => {
      const s = initialPythonNodes.find(n => n.id === e.source);
      const t = initialPythonNodes.find(n => n.id === e.target);
      if (s && t) {
        const dir = getDirection(s, t);
        directions.set(e.id, dir);
        
        if (!expandableDirs.has(e.source)) {
          expandableDirs.set(e.source, new Set());
        }
        expandableDirs.get(e.source)!.add(dir);
      }
    });
    return { edgeDirections: directions, nodeExpandableDirs: expandableDirs };
  }, [initialPythonNodes, initialPythonEdges]);

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
      initialPythonNodes.forEach((n) => {
        if (
          String(n.data.title).toLowerCase().includes(query) ||
          String(n.data.desc).toLowerCase().includes(query)
        ) {
          matches.add(n.id);
          let curr = n.id;
          let parentEdge = initialPythonEdges.find((e) => e.target === curr);
          while (parentEdge) {
            const pId = parentEdge.source;
            const pDir = edgeDirections.get(parentEdge.id);
            if (pDir) {
              effectiveExpanded.add(`${pId}:${pDir}`);
            }
            curr = pId;
            parentEdge = initialPythonEdges.find((e) => e.target === curr);
          }
        }
      });
    }

    const visibleNodes = new Set<string>();
    const queue = [rootId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      visibleNodes.add(current);
      
      const outgoingEdges = initialPythonEdges.filter((e) => e.source === current);
      outgoingEdges.forEach(e => {
        const dir = edgeDirections.get(e.id);
        if (dir && effectiveExpanded.has(`${current}:${dir}`)) {
          queue.push(e.target);
        }
      });
    }

    setNodes((nds) => {
      return initialPythonNodes.map((baseNode) => {
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
      return initialFlowEdges.map((baseEdge) => {
        const existingEdge = eds.find((e) => e.id === baseEdge.id) || baseEdge;
        const isVisible =
          visibleNodes.has(baseEdge.source) && visibleNodes.has(baseEdge.target);

        return {
          ...existingEdge,
          hidden: !isVisible,
        };
      });
    });
  }, [
    expandedNodeDirs,
    searchQuery,
    handleToggle,
    setNodes,
    setEdges,
    initialPythonNodes,
    initialPythonEdges,
    initialFlowEdges,
    edgeDirections,
    nodeExpandableDirs
  ]);

  // Expand the path to a node so it becomes visible (used by in-text links).
  const revealNode = useCallback(
    (id: string) => {
      const dirs = pathDirsToNode(id, initialPythonNodes, initialPythonEdges);
      if (dirs.length) setExpandedNodeDirs((prev) => new Set([...prev, ...dirs]));
    },
    [initialPythonNodes, initialPythonEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    searchQuery,
    setSearchQuery,
    setNodes,
    revealNode,
  };
}
