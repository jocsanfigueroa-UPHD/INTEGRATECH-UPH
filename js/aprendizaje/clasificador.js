import { getTreeConfidence, predictWithTree } from './arbol-decision.js';

export function classifyCase(tree, sample) {
  const label = predictWithTree(tree, sample);
  const confidence = getTreeConfidence(tree, sample) * 100;
  return {
    label,
    confidence: Number(confidence.toFixed(1))
  };
}

