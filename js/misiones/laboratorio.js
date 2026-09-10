import { classifyCase } from '../aprendizaje/clasificador.js';
import { trainDecisionTree } from '../aprendizaje/entrenamiento.js';

export const DATASET_LABORATORIO = [
  { software: 'requerido', estudiantes: 'alto', estado: 'bueno', ram: 'alta', espacio: 'alto', conectividad: 'buena', mantenimiento: 'reciente', label: 'Prioridad alta' },
  { software: 'requerido', estudiantes: 'medio', estado: 'regular', ram: 'media', espacio: 'media', conectividad: 'buena', mantenimiento: 'normal', label: 'Prioridad media' },
  { software: 'no', estudiantes: 'bajo', estado: 'bueno', ram: 'media', espacio: 'alto', conectividad: 'buena', mantenimiento: 'reciente', label: 'Prioridad baja' },
  { software: 'requerido', estudiantes: 'alto', estado: 'malo', ram: 'baja', espacio: 'bajo', conectividad: 'deficiente', mantenimiento: 'antiguo', label: 'Equipo no disponible' },
  { software: 'requerido', estudiantes: 'medio', estado: 'bueno', ram: 'alta', espacio: 'alto', conectividad: 'buena', mantenimiento: 'normal', label: 'Prioridad media' }
];

export function analizarLaboratorio(context = {}) {
  const model = trainDecisionTree(DATASET_LABORATORIO);
  const sample = {
    software: context.software || 'requerido',
    estudiantes: context.estudiantes || 'medio',
    estado: context.estado || 'bueno',
    ram: context.ram || 'media',
    espacio: context.espacio || 'media',
    conectividad: context.conectividad || 'buena',
    mantenimiento: context.mantenimiento || 'normal'
  };
  const prediction = classifyCase(model.tree, sample);
  return {
    mision: 'laboratorio',
    clasificacion: prediction.label,
    confianza: prediction.confidence,
    summary: `Equipo ${prediction.label.toLowerCase()} requiere revisión o reubicación.`
  };
}

