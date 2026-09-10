import { predictWithTree } from './arbol-decision.js';

export function evaluateModel(prediction, expected) {
  if (!Array.isArray(prediction) || !Array.isArray(expected)) {
    return 0;
  }

  const corrected = prediction.filter((value, index) => value === expected[index]).length;
  const total = Math.max(prediction.length, expected.length, 1);
  return Number(((corrected / total) * 100).toFixed(1));
}

export function evaluateDecisionTree(tree, dataset) {
  if (!tree || !Array.isArray(dataset) || dataset.length === 0) {
    return { accuracy: 0, results: [] };
  }

  const predictions = dataset.map((row) => {
    const features = Object.keys(row).filter((key) => key !== 'label').reduce((acc, key) => {
      acc[key] = row[key];
      return acc;
    }, {});
    return {
      expected: row.label,
      actual: predictWithTree(tree, features)
    };
  });

  const accuracy = evaluateModel(predictions.map((row) => row.actual), predictions.map((row) => row.expected));
  return { accuracy, results: predictions };
}

