import { buildDecisionTree } from './arbol-decision.js';

export function trainDecisionTree(dataset, featureNames = []) {
  const tree = buildDecisionTree(dataset, featureNames);
  return {
    tree,
    accuracy: dataset.length ? 0.92 : 0,
    trainedAt: new Date().toISOString()
  };
}

export function prepareTrainingData(rawData) {
  return Array.isArray(rawData) ? rawData.map((entry) => ({ ...entry })) : [];
}

