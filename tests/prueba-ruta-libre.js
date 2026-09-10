import { buildCampusMap } from '../js/planificacion/mapa.js';
import { aStar } from '../js/planificacion/planificador-a-estrella.js';

const map = buildCampusMap();
const route = aStar(map, { x: 1, y: 1 }, { x: 12, y: 3 });

if (!route.found) {
  throw new Error('Ruta libre no encontrada.');
}

if (route.path.length < 2) {
  throw new Error('Ruta libre demasiado corta para ser válida.');
}

console.log('prueba-ruta-libre: OK', route.path.length);
