export const CONFIG = {
  cols: 15,
  rows: 11,
  cellSize: 42,
  robotName: 'ITA-01',
  defaultMission: 'biblioteca',
  maxBattery: 100,
  cycle: {
    perception: 'Escaneo del entorno',
    decision: 'Selección de mejor acción',
    action: 'Ejecución operativa'
  }
};

export const MISIONES = [
  { id: 'biblioteca', name: 'Biblioteca', label: 'Control de aforo', startLabel: 'Entrada principal UPH Danlí', destinationLabel: 'Biblioteca', start: { x: 13, y: 9 }, target: { x: 4, y: 7 } },
  { id: 'matricula', name: 'Matrícula', label: 'Guía presencial', startLabel: 'Atención al cliente', destinationLabel: 'Biblioteca', start: { x: 13, y: 7 }, target: { x: 4, y: 7 } },
  { id: 'red', name: 'Inspección de red', label: 'Biblioteca/TICS → Lab. Turismo', startLabel: 'Biblioteca / TICS', destinationLabel: 'Laboratorio de Turismo / Central de red', start: { x: 7, y: 7 }, target: { x: 13, y: 1 } },
  { id: 'laboratorio', name: 'Laboratorio de Informática', label: 'TICS → Laboratorio', startLabel: 'TICS', destinationLabel: 'Laboratorio de Informática', start: { x: 7, y: 7 }, target: { x: 2, y: 1 } }
];

export function createInitialState(overrides = {}) {
  return {
    posicion: { x: 13, y: 9 },
    objetivo: { x: 12, y: 7 },
    mision: 'biblioteca',
    bateria: CONFIG.maxBattery,
    obstaculos: [],
    rutaActual: [],
    estado: 'listo',
    tareaCompletada: false,
    accionActual: 'esperar',
    planificador: 'activo',
    bitacora: [],
    replanificaciones: 0,
    costoAcumulado: 0,
    acciones: 0,
    clasificacion: 'Sin análisis',
    confianza: 0,
    objetivoSeleccionado: null,
    rutaRecorrida: [],
    ciclo: { percepcion: 'Esperando observación', decision: 'Sin decisión', accion: 'Sin acción' },
    ...overrides
  };
}

export function getMissionDefinition(misionId) {
  return MISIONES.find((mission) => mission.id === misionId) || MISIONES[0];
}
