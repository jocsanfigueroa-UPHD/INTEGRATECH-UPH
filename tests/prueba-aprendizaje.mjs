import { trainDecisionTree } from '../js/aprendizaje/entrenamiento.js';
import { classifyCase } from '../js/aprendizaje/clasificador.js';

const dataset = [
  { riesgo: 'alto', trafico: 'alto', label: 'Riesgo alto' },
  { riesgo: 'medio', trafico: 'medio', label: 'Riesgo medio' },
  { riesgo: 'bajo', trafico: 'bajo', label: 'Riesgo bajo' },
  { riesgo: 'alto', trafico: 'medio', label: 'Riesgo alto' },
  { riesgo: 'medio', trafico: 'bajo', label: 'Riesgo medio' }
];

const model = trainDecisionTree(dataset, ['riesgo', 'trafico']);
const prediction = classifyCase(model.tree, { riesgo: 'alto', trafico: 'bajo' });

if (!prediction.label || prediction.confidence <= 0) {
  throw new Error('El árbol no generó una clasificación válida.');
}

console.log('prueba-aprendizaje: OK', prediction.label, prediction.confidence);
