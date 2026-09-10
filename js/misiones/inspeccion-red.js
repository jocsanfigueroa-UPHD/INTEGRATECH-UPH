import { classifyCase } from '../aprendizaje/clasificador.js';
import { trainDecisionTree } from '../aprendizaje/entrenamiento.js';

export const DATASET_RED = [
  { perdida: 'baja', latencia: 'baja', interferencia: 'baja', antiguedad: 'nueva', desconexiones: 'baja', punto: 'bueno', mantenimiento: 'reciente', label: 'Riesgo bajo' },
  { perdida: 'media', latencia: 'media', interferencia: 'baja', antiguedad: 'media', desconexiones: 'media', punto: 'regular', mantenimiento: 'normal', label: 'Riesgo medio' },
  { perdida: 'alta', latencia: 'alta', interferencia: 'alta', antiguedad: 'alta', desconexiones: 'alta', punto: 'malo', mantenimiento: 'antiguo', label: 'Riesgo alto' },
  { perdida: 'media', latencia: 'alta', interferencia: 'media', antiguedad: 'alta', desconexiones: 'alta', punto: 'regular', mantenimiento: 'antiguo', label: 'Riesgo alto' },
  { perdida: 'baja', latencia: 'baja', interferencia: 'media', antiguedad: 'media', desconexiones: 'baja', punto: 'bueno', mantenimiento: 'reciente', label: 'Riesgo bajo' }
];

export function analizarRed(context = {}) {
  const model = trainDecisionTree(DATASET_RED);
  const sample = {
    perdida: context.perdida || 'media',
    latencia: context.latencia || 'media',
    interferencia: context.interferencia || 'baja',
    antiguedad: context.antiguedad || 'media',
    desconexiones: context.desconexiones || 'media',
    punto: context.punto || 'regular',
    mantenimiento: context.mantenimiento || 'normal'
  };
  const prediction = classifyCase(model.tree, sample);
  return {
    mision: 'red',
    clasificacion: prediction.label,
    confianza: prediction.confidence,
    summary: `Punto ${prediction.label.toLowerCase()} requiere prioridad de inspección.`
  };
}

