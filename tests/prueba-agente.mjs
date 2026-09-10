import { Robot } from '../js/agente/robot.js';
import { executeAction } from '../js/agente/acciones.js';
import { buildCampusMap } from '../js/planificacion/mapa.js';
import { aStar } from '../js/planificacion/algoritmo-a-estrella.js';

const map = buildCampusMap();
const robot = new Robot({ posicion: { x: 1, y: 1 }, bateria: 3 });
const blocked = executeAction(robot, 'arriba', map);
if (blocked.ok || robot.acciones !== 0) throw new Error('Se permitió atravesar una pared.');

const route = aStar(map, robot.posicion, { x: 2, y: 1 });
if (!route.found) throw new Error('No se encontró una ruta corta válida.');
const moved = executeAction(robot, 'derecha', map);
if (!moved.ok || robot.posicion.x !== 2 || robot.bateria !== 2 || robot.costoAcumulado !== 1) {
  throw new Error('El movimiento no actualizó posición, batería y costo correctamente.');
}

robot.establecerObjetivo(robot.posicion);
robot.completar();
if (!robot.tareaCompletada || robot.estado !== 'completado') throw new Error('La misión no se marcó como completada.');
console.log('prueba-agente: OK');
