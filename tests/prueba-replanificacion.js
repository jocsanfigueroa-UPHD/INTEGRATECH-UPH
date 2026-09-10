import { buildCampusMap } from '../js/planificacion/mapa.js';
import { replanificarRuta } from '../js/planificacion/replanificacion.js';

const map = buildCampusMap();
const outcome = replanificarRuta(map, { x: 1, y: 1 }, { x: 12, y: 8 }, [{ x: 7, y: 3 }, { x: 8, y: 3 }]);

if (!outcome.found) {
  throw new Error('La replanificación no devolvió una ruta válida.');
}

console.log('prueba-replanificacion: OK', outcome.path.length);

