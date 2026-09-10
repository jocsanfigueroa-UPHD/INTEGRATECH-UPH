export function getTerrainCost(map, x, y) {
  if (!map || typeof x !== 'number' || typeof y !== 'number') {
    return 1;
  }

  if (map.closedOffices.some((cell) => cell.x === x && cell.y === y)) {
    return Number.POSITIVE_INFINITY;
  }

  if (map.congestionZones.some((cell) => cell.x === x && cell.y === y)) {
    return 7;
  }

  if (map.trafficZones.some((cell) => cell.x === x && cell.y === y)) {
    return 4;
  }

  return 1;
}

export function costFromRoute(route, map) {
  if (!Array.isArray(route) || route.length === 0) return 0;
  let total = 0;
  for (const cell of route) {
    total += getTerrainCost(map, cell.x, cell.y);
  }
  return total;
}

