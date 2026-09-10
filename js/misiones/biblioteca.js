import { classifyCase } from '../aprendizaje/clasificador.js';
import { trainDecisionTree } from '../aprendizaje/entrenamiento.js';

export const DATASET_BIBLIOTECA = [
  { examenes: 'si', ruido: 'alto', estudiantes: 'alto', capacidad: 'media', congestion: 'alta', label: 'Prioridad alta' },
  { examenes: 'no', ruido: 'medio', estudiantes: 'medio', capacidad: 'alta', congestion: 'media', label: 'Prioridad media' },
  { examenes: 'no', ruido: 'bajo', estudiantes: 'bajo', capacidad: 'alta', congestion: 'baja', label: 'Prioridad baja' },
  { examenes: 'si', ruido: 'medio', estudiantes: 'alto', capacidad: 'media', congestion: 'alta', label: 'Prioridad alta' },
  { examenes: 'no', ruido: 'bajo', estudiantes: 'medio', capacidad: 'alta', congestion: 'baja', label: 'Prioridad baja' }
];

export function analizarBiblioteca(context = {}) {
  const model = trainDecisionTree(DATASET_BIBLIOTECA);
  const sample = {
    examenes: context.examenes || 'no',
    ruido: context.ruido || 'medio',
    estudiantes: context.estudiantes || 'medio',
    capacidad: context.capacidad || 'alta',
    congestion: context.congestion || 'media'
  };
  const prediction = classifyCase(model.tree, sample);
  return {
    mision: 'biblioteca',
    clasificacion: prediction.label,
    confianza: prediction.confidence,
    summary: `Zona ${prediction.label.toLowerCase()} priorizada para supervisión.`
  };
}

