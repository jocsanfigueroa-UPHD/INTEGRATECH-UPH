import { buildCampusMap } from '../js/planificacion/mapa.js';
import { aStar } from '../js/planificacion/planificador-a-estrella.js';

const map = buildCampusMap({
  width: 5,
  height: 5,
  walls: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
  obstacles: [],
  closedOffices: [],
  congestionZones: [],
  trafficZones: []
});

const start = { x: 0, y: 0 };
const goal = { x: 4, y: 4 };
const route = aStar(map, start, goal);

if (route.found) {
  throw new Error('Se encontró una ruta en un escenario bloqueado.');
}

console.log('prueba-sin-ruta: OK');
