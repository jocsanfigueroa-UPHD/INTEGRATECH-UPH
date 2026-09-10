import { isCellBlocked } from '../planificacion/mapa.js';
import { getTerrainCost } from '../planificacion/costos.js';

export const ACTIONS = {
  arriba: { dx: 0, dy: -1, label: 'Mover arriba' },
  abajo: { dx: 0, dy: 1, label: 'Mover abajo' },
  izquierda: { dx: -1, dy: 0, label: 'Mover a la izquierda' },
  derecha: { dx: 1, dy: 0, label: 'Mover a la derecha' },
  inspeccionar: { label: 'Inspeccionar' },
  supervisar: { label: 'Supervisar' },
  guiar: { label: 'Guiar estudiantes' },
  revisar: { label: 'Revisar equipos' },
  entregar: { label: 'Entregar documentos' },
  esperar: { label: 'Esperar' },
  recalcular: { label: 'Recalcular ruta' },
  finalizar: { label: 'Finalizar misión' }
};

export function executeAction(robot, actionKey, map = null) {
  const action = ACTIONS[actionKey] || ACTIONS.esperar;

  if (action.dx !== undefined && action.dy !== undefined) {
    const next = { x: robot.posicion.x + action.dx, y: robot.posicion.y + action.dy };
    if (map && isCellBlocked(map, next.x, next.y)) return { ok: false, message: `Movimiento bloqueado en (${next.x}, ${next.y}).` };
    if (robot.bateria <= 0) return { ok: false, message: 'Batería agotada; no se puede mover.' };
    robot.mover(action.dx, action.dy);
    robot.costoAcumulado += getTerrainCost(map, next.x, next.y);
    return { ok: true, action: actionKey, position: { ...robot.posicion } };
  }

  if (actionKey === 'inspeccionar') {
    robot.registrarEvento(`Inspección realizada en ${robot.posicionTexto}`, 'success');
    return { ok: true, action: 'inspeccionar', position: { ...robot.posicion } };
  }

  if (actionKey === 'recalcular') {
    robot.registrarEvento('Ruta recalculada por cambio de condiciones', 'warning');
    return { ok: true, action: 'recalcular', position: { ...robot.posicion } };
  }

  if (actionKey === 'finalizar') {
    robot.completar();
    robot.registrarEvento('Misión finalizada con éxito', 'success');
    return { ok: true, action: 'finalizar', position: { ...robot.posicion } };
  }

  if (map) {
    const next = { x: robot.posicion.x, y: robot.posicion.y };
    robot.registrarEvento(`Acción ${action.label.toLowerCase()} ejecutada`, 'info');
    return { ok: true, action: actionKey, position: next };
  }

  robot.registrarEvento(`Acción ${action.label.toLowerCase()} ejecutada`, 'info');
  return { ok: true, action: actionKey, position: { ...robot.posicion } };
}

