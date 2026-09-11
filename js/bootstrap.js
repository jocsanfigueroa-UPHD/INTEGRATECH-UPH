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
import { AREAS_OPERATIVAS, evaluarInspeccion, ejecutarRondaAutomatica, crearSolicitudAsistencia } from './automatizacion/inspecciones.js';

const analyzers = { biblioteca: analizarBiblioteca, matricula: analizarMatricula, red: analizarRed, laboratorio: analizarLaboratorio };
const initialMission = getMissionDefinition(CONFIG.defaultMission);
const state = createInitialState({ mision: CONFIG.defaultMission, posicion: initialMission.start, objetivo: initialMission.target });
let map = buildCampusMap();
let robot = new Robot({ ...state });
let currentPlan = { found: false, path: [], visited: [], cost: 0 };
let inspectionHistory = JSON.parse(localStorage.getItem('integratech-inspections') || '[]');
let assistanceRequests = JSON.parse(localStorage.getItem('integratech-assistance') || '[]');
let lastInspection = null;

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
  renderInspectionPanel();
}

function currentArea() { return AREAS_OPERATIVAS.find((area) => area.id === state.mision) || AREAS_OPERATIVAS[0]; }
function persistOperations() {
  localStorage.setItem('integratech-inspections', JSON.stringify(inspectionHistory.slice(0, 50)));
  localStorage.setItem('integratech-assistance', JSON.stringify(assistanceRequests.slice(0, 50)));
}
function renderChecklist() {
  const container = document.getElementById('inspectionChecklist');
  if (!container) return;
  container.innerHTML = currentArea().items.map((item, index) => `<label class="inspection-row"><span>${item}</span><select data-inspection-index="${index}"><option value="correcto">Correcto</option><option value="alerta">Requiere atención</option><option value="critico">Crítico</option></select></label>`).join('');
}
function renderInspectionPanel() {
  const tbody = document.getElementById('inspectionHistory');
  if (tbody) tbody.innerHTML = inspectionHistory.length ? inspectionHistory.slice(0, 12).map((item) => `<tr><td>${new Date(item.fecha).toLocaleString('es-HN')}</td><td>${item.area}</td><td><span class="result-badge ${item.nivel}">${item.nivel}</span></td><td>${item.responsable}</td><td>${item.requiereAsistencia ? 'Requerida' : 'No requerida'}</td></tr>`).join('') : '<tr><td colspan="5" class="empty-state">Aún no se han realizado inspecciones.</td></tr>';
  const pending = assistanceRequests.filter((item) => item.estado === 'Pendiente');
  const counter = document.getElementById('pendingCount');
  if (counter) counter.textContent = `${pending.length} pendiente${pending.length === 1 ? '' : 's'}`;
  const list = document.getElementById('assistanceList');
  if (list) list.innerHTML = assistanceRequests.length ? assistanceRequests.slice(0, 10).map((item) => `<li class="assistance-card ${item.prioridad === 'Alta' ? 'high' : ''}"><div><strong>${item.id} · ${item.area}</strong><p>${item.prioridad} · ${item.responsable}<br>${item.motivo} · Estado: ${item.estado}</p></div>${item.estado === 'Pendiente' ? `<button data-resolve-request="${item.id}">Atendida</button>` : ''}</li>`).join('') : '<li class="empty-state">No existen solicitudes de asistencia.</li>';
  document.querySelectorAll('[data-resolve-request]').forEach((button) => button.addEventListener('click', () => resolveAssistance(button.dataset.resolveRequest)));
}
function readChecklist() { return [...document.querySelectorAll('[data-inspection-index]')].map((select) => select.value); }
function inspectArea() {
  const result = evaluarInspeccion(state.mision, readChecklist());
  lastInspection = result;
  inspectionHistory.unshift(result);
  state.clasificacion = result.nivel === 'normal' ? 'Operación normal' : result.nivel === 'crítico' ? 'Riesgo alto' : 'Requiere atención';
  state.confianza = 96;
  document.getElementById('automationStatus').textContent = `Inspección: ${result.nivel}`;
  log(`${result.area}: ${result.resumen}`, result.nivel === 'normal' ? 'success' : result.nivel === 'crítico' ? 'danger' : 'warning');
  if (result.requiereAsistencia) requestAssistance(true);
  persistOperations(); refresh();
}
function autoInspect() {
  const scenarios = {
    biblioteca: ['correcto','correcto','alerta','correcto'], matricula: ['alerta','correcto','correcto','correcto'],
    red: ['correcto','critico','alerta','correcto'], laboratorio: ['correcto','correcto','correcto','correcto']
  };
  const results = ejecutarRondaAutomatica(scenarios);
  inspectionHistory.unshift(...results);
  results.filter((item) => item.requiereAsistencia).forEach((item) => { lastInspection = item; requestAssistance(true, false); });
  lastInspection = results.find((item) => item.areaId === state.mision) || results[0];
  document.getElementById('automationStatus').textContent = 'Ronda completada';
  log(`Ronda automática finalizada: ${results.length} áreas inspeccionadas y ${results.filter((r) => r.requiereAsistencia).length} con asistencia requerida.`, 'success');
  persistOperations(); refresh();
}
function requestAssistance(automatic = false, redraw = true) {
  if (!lastInspection) lastInspection = evaluarInspeccion(state.mision, readChecklist());
  const reason = document.getElementById('assistanceReason')?.value || '';
  const request = crearSolicitudAsistencia(lastInspection, reason);
  if (!assistanceRequests.some((item) => item.inspeccionId === request.inspeccionId && item.estado === 'Pendiente')) assistanceRequests.unshift(request);
  const banner = document.getElementById('notificationBanner');
  if (banner) { banner.classList.remove('hidden'); banner.textContent = `Asistencia solicitada en ${request.area}. Responsable: ${request.responsable}. Prioridad: ${request.prioridad}.`; }
  log(`${automatic ? 'Alerta automática' : 'Solicitud'} ${request.id}: asistencia requerida en ${request.area}.`, request.prioridad === 'Alta' ? 'danger' : 'warning');
  sendBrowserNotification(request);
  persistOperations(); if (redraw) refresh();
}
function resolveAssistance(id) {
  const request = assistanceRequests.find((item) => item.id === id);
  if (request) { request.estado = 'Atendida'; request.atendida = new Date().toISOString(); log(`${id}: asistencia atendida en ${request.area}.`, 'success'); persistOperations(); refresh(); }
}
async function enableNotifications() {
  if (!('Notification' in window)) { log('El navegador no admite notificaciones del sistema.', 'warning'); return; }
  const permission = await Notification.requestPermission();
  log(permission === 'granted' ? 'Notificaciones del navegador activadas.' : 'Permiso de notificaciones no concedido.', permission === 'granted' ? 'success' : 'warning'); refresh();
}
function sendBrowserNotification(request) {
  if ('Notification' in window && Notification.permission === 'granted') new Notification('INTEGRATECH-UPH · Asistencia requerida', { body: `${request.area}: ${request.motivo} Responsable: ${request.responsable}.` });
  try { const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAACAgICAgICAgICA'); audio.play().catch(() => {}); } catch (_) {}
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
  Object.assign(state, createInitialState({ mision: id, posicion: selected.start, objetivo: selected.target }));
  robot = new Robot({ ...createInitialState({ mision: id, posicion: selected.start, objetivo: selected.target }) });
  currentPlan = { found: false, path: [], visited: [], cost: 0 };
  log(`Misión seleccionada: ${selected.name}.`, 'info');
  renderMissionMenu(MISIONES, state.mision, selectMission);
  renderChecklist();
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
bindControls({ analyze, plan, execute, pause, continue: continueOperation, reset, obstacle: addObstacle, office: closeOffice, traffic: simulateTraffic, failure, objective: changeObjective, inspect: inspectArea, 'auto-inspect': autoInspect, 'request-assistance': () => requestAssistance(false), 'enable-notifications': enableNotifications });
renderChecklist();
log('Sistema listo para operar.', 'success');
refresh();
