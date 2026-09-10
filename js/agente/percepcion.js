import { isCellBlocked } from '../planificacion/mapa.js';

export function perceiveEnvironment(robot, map, nextCell = null) {
  const neighbours = [
    { x: robot.posicion.x, y: robot.posicion.y - 1 },
    { x: robot.posicion.x + 1, y: robot.posicion.y },
    { x: robot.posicion.x, y: robot.posicion.y + 1 },
    { x: robot.posicion.x - 1, y: robot.posicion.y }
  ];

  const blocked = neighbours.filter((cell) => isCellBlocked(map, cell.x, cell.y));
  const obstacleAhead = nextCell ? isCellBlocked(map, nextCell.x, nextCell.y) : false;
  const traffic = map.congestionZones.some((cell) => cell.x === robot.posicion.x && cell.y === robot.posicion.y)
    ? 'alto'
    : map.trafficZones.some((cell) => cell.x === robot.posicion.x && cell.y === robot.posicion.y)
      ? 'medio'
      : 'bajo';

  return {
    perception: `Posición ${robot.posicionTexto}; tráfico ${traffic}; obstáculos cercanos: ${blocked.length}`,
    obstacleAhead,
    blockedCells: blocked,
    traffic,
    objective: robot.objetivo
  };
}

