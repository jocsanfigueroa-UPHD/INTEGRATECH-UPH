import { classifyCase } from '../aprendizaje/clasificador.js';
import { trainDecisionTree } from '../aprendizaje/entrenamiento.js';

export const DATASET_MATRICULA = [
  { indice: 'alto', pendientes: 'bajo', ajuste: 'no', bloqueo: 'no', doc: 'si', historial: 'bueno', label: 'Matrícula regular' },
  { indice: 'medio', pendientes: 'medio', ajuste: 'si', bloqueo: 'no', doc: 'si', historial: 'bueno', label: 'Ajuste académico' },
  { indice: 'bajo', pendientes: 'alto', ajuste: 'no', bloqueo: 'si', doc: 'no', historial: 'regular', label: 'Caso especial' },
  { indice: 'medio', pendientes: 'alto', ajuste: 'si', bloqueo: 'no', doc: 'si', historial: 'regular', label: 'Ajuste académico' },
  { indice: 'alto', pendientes: 'bajo', ajuste: 'no', bloqueo: 'no', doc: 'si', historial: 'regular', label: 'Matrícula regular' }
];

export function analizarMatricula(context = {}) {
  const model = trainDecisionTree(DATASET_MATRICULA);
  const sample = {
    indice: context.indice || 'medio',
    pendientes: context.pendientes || 'medio',
    ajuste: context.ajuste || 'no',
    bloqueo: context.bloqueo || 'no',
    doc: context.doc || 'si',
    historial: context.historial || 'bueno'
  };
  const prediction = classifyCase(model.tree, sample);
  return {
    mision: 'matricula',
    clasificacion: prediction.label,
    confianza: prediction.confidence,
    summary: `Trámite ${prediction.label.toLowerCase()} con asignación a oficina correspondiente.`
  };
}

