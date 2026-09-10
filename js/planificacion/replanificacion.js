import { aStar } from './planificador-a-estrella.js';

export function replanificarRuta(map, start, goal, obstacles = []) {
  const routeMap = { ...map, obstacles: [...(map.obstacles || []), ...obstacles] };
  const route = aStar(routeMap, start, goal);
  return {
    found: route.found,
    path: route.path,
    cost: route.cost,
    reason: route.found ? 'Ruta recalculada tras cambio de condiciones.' : 'No existe ruta factible tras la actualización.'
  };
}
