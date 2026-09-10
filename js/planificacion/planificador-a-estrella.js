import { getNeighbors, isCellBlocked, manhattanDistance, serializeCell } from './mapa.js';
import { getTerrainCost } from './costos.js';

export function aStar(map, start, goal) {
  if (!map || !start || !goal || isCellBlocked(map, start.x, start.y) || isCellBlocked(map, goal.x, goal.y)) {
    return { found: false, path: [], visited: [], cost: 0 };
  }
  const open = [{ ...start, g: 0, f: manhattanDistance(start, goal) }];
  const parents = new Map();
  const scores = new Map([[serializeCell(start), 0]]);
  const closed = new Set();
  const visited = [];
  while (open.length) {
    open.sort((a, b) => a.f - b.f || a.g - b.g);
    const current = open.shift();
    const key = serializeCell(current);
    if (closed.has(key)) continue;
    closed.add(key);
    visited.push({ x: current.x, y: current.y });
    if (current.x === goal.x && current.y === goal.y) {
      const path = [{ x: goal.x, y: goal.y }];
      let cursor = key;
      while (parents.has(cursor)) {
        const parent = parents.get(cursor);
        path.unshift({ ...parent });
        cursor = serializeCell(parent);
      }
      return { found: true, path, visited, cost: scores.get(key) ?? 0 };
    }
    for (const next of getNeighbors(map, current.x, current.y)) {
      const nextKey = serializeCell(next);
      if (closed.has(nextKey)) continue;
      const tentative = (scores.get(key) ?? 0) + getTerrainCost(map, next.x, next.y);
      if (tentative < (scores.get(nextKey) ?? Number.POSITIVE_INFINITY)) {
        parents.set(nextKey, { x: current.x, y: current.y });
        scores.set(nextKey, tentative);
        open.push({ ...next, g: tentative, f: tentative + manhattanDistance(next, goal) });
      }
    }
  }
  return { found: false, path: [], visited, cost: 0 };
}
