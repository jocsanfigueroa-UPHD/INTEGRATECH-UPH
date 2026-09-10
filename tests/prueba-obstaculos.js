import { buildCampusMap } from '../js/planificacion/mapa.js';
import { aStar } from '../js/planificacion/planificador-a-estrella.js';

const map = buildCampusMap({
  obstacles: [{ x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 10, y: 5 }]
});
const route = aStar(map, { x: 1, y: 1 }, { x: 12, y: 8 });

if (!route.found) {
  throw new Error('No se encontró ruta alternativa con obstáculos.');
}

console.log('prueba-obstaculos: OK', route.path.length);
