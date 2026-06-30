import React from 'react';
import { EdgeProps, getBezierPath, useInternalNode, Position } from '@xyflow/react';

// Рассчитываем точное пересечение линии (от центра до центра) с границами узла
function getNodeIntersection(intersectionNode: any, targetNode: any) {
  const { width, height } = intersectionNode.measured || { width: 0, height: 0 };
  const pos = intersectionNode.internals.positionAbsolute;
  const targetPos = targetNode.internals.positionAbsolute;

  const w = width / 2;
  const h = height / 2;

  const x2 = pos.x + w;
  const y2 = pos.y + h;
  const x1 = targetPos.x + (targetNode.measured?.width || 0) / 2;
  const y1 = targetPos.y + (targetNode.measured?.height || 0) / 2;

  let dx = x1 - x2;
  let dy = y1 - y2;

  if (dx === 0 && dy === 0) return { x: x2, y: y2 };

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let x, y;
  if (absDx * h > absDy * w) {
    x = dx > 0 ? pos.x + width : pos.x;
    y = y2 + dy * (w / absDx);
  } else {
    y = dy > 0 ? pos.y + height : pos.y;
    x = x2 + dx * (h / absDy);
  }

  return { x, y };
}

function getEdgePosition(node: any, intersectionPoint: any) {
  const n = { ...node.internals.positionAbsolute, ...node.measured };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) return Position.Left;
  if (px >= nx + n.width - 1) return Position.Right;
  if (py <= ny + 1) return Position.Top;
  if (py >= ny + n.height - 1) return Position.Bottom;

  return Position.Top;
}

export default function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  animated
}: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode || !sourceNode.measured?.width || !targetNode.measured?.width) {
    return null;
  }

  const sourceIntersection = getNodeIntersection(sourceNode, targetNode);
  const targetIntersection = getNodeIntersection(targetNode, sourceNode);

  const sourcePos = getEdgePosition(sourceNode, sourceIntersection);
  const targetPos = getEdgePosition(targetNode, targetIntersection);

  const [edgePath] = getBezierPath({
    sourceX: sourceIntersection.x,
    sourceY: sourceIntersection.y,
    sourcePosition: sourcePos,
    targetX: targetIntersection.x,
    targetY: targetIntersection.y,
    targetPosition: targetPos,
  });

  return (
    <>
      {/* Wide transparent path so the (otherwise thin) edge is easy to click. */}
      <path className="react-flow__edge-interaction" d={edgePath} fill="none" stroke="transparent" strokeWidth={20} />
      <path
        id={id}
        className={`react-flow__edge-path ${animated ? 'custom-animated' : ''}`}
        d={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, fill: 'none' }}
      />
    </>
  );
}
