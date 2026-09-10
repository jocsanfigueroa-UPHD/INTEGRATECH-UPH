import { CONFIG, MISIONES, createInitialState, getMissionDefinition } from './configuracion.js';
import { Robot } from './agente/robot.js';
import { perceiveEnvironment } from './agente/percepcion.js';
import { decideAction } from './agente/decisiones.js';
import { executeAction } from './agente/acciones.js';
import { buildCampusMap, isCellBlocked } from './planificacion/mapa.js';
import { aStar } from './planificacion/algoritmo-a-estrella.js';
import { replanificarRuta } from './planificacion/replanificacion.js';
import { renderMissionMenu } from './interfaz/menu.js';
import { bindControls } from './interfaz/controles.js';
import { updateDashboard } from './interfaz/panel-estado.js';
import { renderCampus } from './interfaz/simulador.js';
import { analizarBiblioteca } from './misiones/biblioteca.js';
import { analizarMatricula } from './misiones/matricula.js';
import { analizarRed } from './misiones/inspeccion-red.js';
import { analizarLaboratorio } from './misiones/laboratorio.js';

const analyzers = { biblioteca: analizarBiblioteca, matricula: analizarMatricula, red: analizarRed, laboratorio: analizarLaboratorio };
const state = createInitialState({ mision: CONFIG.defaultMission });
let map = buildCampusMap();
let robot = new Robot({ ...state, objetivo: getMissionDefinition(state.mision).target });
let currentPlan = { found: false, path: [], visited: [], cost: 0 };

function mission() { return getMissionDefinition(state.mision); }
function log(message, level = 'info') {
  robot.registrarEvento(message, level);
  state.bitacora = [...robot.bitacora].reverse();
}
function directionTo(next, current) {
  if (!next || !current) return null;
  if (next.x > current.x) return 'derecha';
  if (next.x < current.x) return 'izquierda';
  if (next.y > current.y) return 'abajo';
  return 'arriba';
}
function refresh() {
  updateDashboard({
    missionName: mission().name,
    stateName: state.estado,
    objective: robot.objetivo,
    actionCount: robot.acciones,
    costTotal: robot.costoAcumulado,
    replanCount: robot.replanificaciones,
    position: robot.posicion,
    classification: state.clasificacion,
    confidence: `${state.confianza}%`,
    path: robot.rutaActual.map((cell) => `(${cell.x},${cell.y})`).join(' -> ') || 'Sin ruta',
    history: robot.rutaRecorrida.map((cell) => `(${cell.x},${cell.y})`).join(' -> ') || 'Sin movimientos',
    perception: state.ciclo.percepcion,
    decision: state.ciclo.decision,
    action: robot.accionActual,
    log: state.bitacora
  });
  renderCampus(document.getElementById('mapCanvas'), { robot, objective: robot.objetivo, route: robot.rutaActual, map, mission: mission().name, classification: state.clasificacion });
  const plannerStatus = document.getElementById('plannerStatus');
  const modelStatus = document.getElementById('modelStatus');
  if (plannerStatus) plannerStatus.textContent = `Planificador: ${currentPlan.found ? 'ruta lista' : 'esperando'}`;
  if (modelStatus) modelStatus.textContent = `Modelo: ${state.clasificacion === 'Sin análisis' ? 'sin analizar' : 'entrenado'}`;
}
function analyze() {
  const perception = perceiveEnvironment(robot, map, currentPlan.path[1]);
  const result = analyzers[state.mision]({ congestion: perception.traffic, trafico: perception.traffic });
  state.clasificacion = result.clasificacion;
  state.confianza = result.confianza;
  state.estado = 'analizando';
  log(`${result.summary} Confianza: ${result.confianza}%.`, 'success');
  refresh();
}
function plan() {
  currentPlan = aStar(map, robot.posicion, robot.objetivo);
  robot.rutaActual = currentPlan.path;
  state.rutaActual = currentPlan.path;
  state.estado = currentPlan.found ? 'planificado' : 'ruta-no-disponible';
  log(currentPlan.found ? `Ruta planificada con ${currentPlan.path.length - 1} movimientos.` : 'No existe una ruta viable para el objetivo.', currentPlan.found ? 'info' : 'danger');
  refresh();
}
function execute() {
  if (['pausado', 'fallo-detectado', 'completado'].includes(state.estado)) {
    log(`La operación está ${state.estado}; no se ejecutó ningún movimiento.`, 'warning');
    refresh();
    return;
  }
  if (!currentPlan.found || !currentPlan.path.length || currentPlan.path[0].x !== robot.posicion.x || currentPlan.path[0].y !== robot.posicion.y) currentPlan = aStar(map, robot.posicion, robot.objetivo);
  if (robot.posicion.x === robot.objetivo.x && robot.posicion.y === robot.objetivo.y) {
    robot.completar();
    state.estado = 'completado';
    state.ciclo = { percepcion: 'Objetivo localizado en la posición actual.', decision: 'Finalizar misión', accion: 'finalizar' };
    log(`Misión ${mission().name} completada.`, 'success');
    refresh();
    return;
  }
  const perception = perceiveEnvironment(robot, map, currentPlan.path[1]);
  const decision = decideAction({ route: currentPlan.path, perception, classification: state.clasificacion, status: state.estado });
  state.ciclo = { percepcion: perception.perception, decision: decision.label, accion: decision.kind };
  if (!currentPlan.found || decision.kind === 'recalcular') {
    robot.replanificaciones += 1;
    const replanned = replanificarRuta(map, robot.posicion, robot.objetivo);
    currentPlan = { ...replanned, visited: [] };
    robot.rutaActual = currentPlan.path;
    state.rutaActual = currentPlan.path;
    log(replanned.reason, 'warning');
    refresh();
    return;
  }
  const movement = directionTo(currentPlan.path[1], robot.posicion);
  if (decision.kind === 'supervisar' || decision.kind === 'guiar') {
    log(`${decision.label}: ${decision.reason}`, 'info');
  }
  const result = executeAction(robot, movement, map);
  if (!result.ok) {
    robot.replanificaciones += 1;
    log(result.message, 'warning');
  } else {
    state.estado = 'ejecutando';
    robot.accionActual = result.action;
    log(`Movimiento ejecutado hacia ${robot.posicionTexto}.`, 'info');
  }
  if (robot.posicion.x === robot.objetivo.x && robot.posicion.y === robot.objetivo.y) {
    robot.completar();
    state.estado = 'completado';
    log(`Misión ${mission().name} completada.`, 'success');
  }
  currentPlan = aStar(map, robot.posicion, robot.objetivo);
  robot.rutaActual = currentPlan.path;
  state.rutaActual = currentPlan.path;
  refresh();
}
function selectMission(id) {
  state.mision = id;
  const selected = getMissionDefinition(id);
  Object.assign(state, createInitialState({ mision: id, objetivo: selected.target }));
  robot = new Robot({ ...createInitialState({ mision: id, objetivo: selected.target }) });
  currentPlan = { found: false, path: [], visited: [], cost: 0 };
  log(`Misión seleccionada: ${selected.name}.`, 'info');
  renderMissionMenu(MISIONES, state.mision, selectMission);
  refresh();
}
function reset() { map = buildCampusMap(); selectMission(state.mision); log('Sistema restablecido a condiciones iniciales.', 'info'); refresh(); }
function addUnique(list, cell) { if (!list.some((item) => item.x === cell.x && item.y === cell.y)) list.push(cell); }
function addObstacle() {
  const candidate = [{ x: 7, y: 2 }, { x: 4, y: 5 }, { x: 10, y: 6 }, { x: 2, y: 7 }].find((cell) => !isCellBlocked(map, cell.x, cell.y) && !(cell.x === robot.posicion.x && cell.y === robot.posicion.y) && !(cell.x === robot.objetivo.x && cell.y === robot.objetivo.y));
  if (candidate) addUnique(map.obstacles, candidate);
  log(candidate ? `Obstáculo registrado en (${candidate.x}, ${candidate.y}).` : 'No hay una celda libre para registrar.', 'warning');
  refresh();
}
function closeOffice() { addUnique(map.closedOffices, { x: 12, y: 6 }); log('Oficina cerrada en (12, 6).', 'danger'); refresh(); }
function simulateTraffic() { addUnique(map.congestionZones, { x: 7, y: 4 }); log('Congestión simulada en el pasillo central.', 'warning'); refresh(); }
function failure() { state.estado = 'fallo-detectado'; log('Falla operativa detectada. Restablezca o continúe cuando sea seguro.', 'danger'); refresh(); }
function pause() { state.estado = 'pausado'; log('Operación pausada por el supervisor.', 'warning'); refresh(); }
function continueOperation() { state.estado = state.estado === 'fallo-detectado' ? 'listo' : 'ejecutando'; log('Operación reanudada.', 'success'); refresh(); }
function changeObjective() { const next = MISIONES[(MISIONES.findIndex((item) => item.id === state.mision) + 1) % MISIONES.length]; selectMission(next.id); }

renderMissionMenu(MISIONES, state.mision, selectMission);
bindControls({ analyze, plan, execute, pause, continue: continueOperation, reset, obstacle: addObstacle, office: closeOffice, traffic: simulateTraffic, failure, objective: changeObjective });
log('Sistema listo para operar.', 'success');
refresh();
