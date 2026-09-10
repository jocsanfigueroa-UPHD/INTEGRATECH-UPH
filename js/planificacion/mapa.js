export const CAMPUS_MAP = {
  width: 15,
  height: 11,
  walls: [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
    { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
    { x: 12, y: 0 }, { x: 13, y: 0 }, { x: 14, y: 0 },

    { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 5, y: 10 },
    { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 10 },
    { x: 12, y: 10 }, { x: 13, y: 10 }, { x: 14, y: 10 },

    { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
    { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 },
    { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 },
    { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 },

    { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 },
    { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 },
    { x: 7, y: 9 }, { x: 8, y: 9 }
  ],
  obstacles: [
    { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 6 }, { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 3, y: 7 }
  ],
  closedOffices: [
    { x: 4, y: 8 }, { x: 12, y: 6 }
  ],
  congestionZones: [
    { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 8, y: 6 }, { x: 3, y: 5 }
  ],
  trafficZones: [
    { x: 2, y: 3 }, { x: 10, y: 7 }, { x: 4, y: 6 }
  ],
  facilities: {
    biblioteca: { x: 12, y: 3 },
    registro: { x: 3, y: 8 },
    laboratorio: { x: 8, y: 2 },
    aulas: { x: 5, y: 4 },
    red: { x: 11, y: 8 }
  }
};

export function buildCampusMap(overrides = {}) {
  return {
    ...CAMPUS_MAP,
    ...overrides,
    obstacles: [...(overrides.obstacles || CAMPUS_MAP.obstacles)],
    closedOffices: [...(overrides.closedOffices || CAMPUS_MAP.closedOffices)],
    congestionZones: [...(overrides.congestionZones || CAMPUS_MAP.congestionZones)],
    trafficZones: [...(overrides.trafficZones || CAMPUS_MAP.trafficZones)],
    walls: [...(overrides.walls || CAMPUS_MAP.walls)]
  };
}

export function isInsideMap(map, x, y) {
  return x >= 0 && y >= 0 && x < map.width && y < map.height;
}

export function isCellBlocked(map, x, y) {
  if (!isInsideMap(map, x, y)) return true;
  const wall = map.walls.some((cell) => cell.x === x && cell.y === y);
  const obstacle = map.obstacles.some((cell) => cell.x === x && cell.y === y);
  const officeClosed = map.closedOffices.some((cell) => cell.x === x && cell.y === y);
  return wall || obstacle || officeClosed;
}

export function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getNeighbors(map, x, y) {
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];

  return directions
    .map((dir) => ({ x: x + dir.x, y: y + dir.y }))
    .filter((node) => !isCellBlocked(map, node.x, node.y));
}

export function serializeCell(cell) {
  return `${cell.x},${cell.y}`;
}

