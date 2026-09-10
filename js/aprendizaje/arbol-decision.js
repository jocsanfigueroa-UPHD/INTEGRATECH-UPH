export function entropy(labels) {
  const counts = {};
  for (const label of labels) {
    counts[label] = (counts[label] || 0) + 1;
  }

  let value = 0;
  const total = labels.length;
  for (const count of Object.values(counts)) {
    const p = count / total;
    value -= p * Math.log2(p);
  }

  return Number.isFinite(value) ? value : 0;
}

export function gainRatio(dataset, feature, labelKey = 'label') {
  const values = [...new Set(dataset.map((row) => row[feature]))];
  const total = dataset.length;
  const parentEntropy = entropy(dataset.map((row) => row[labelKey]));

  let weighted = 0;
  for (const value of values) {
    const subset = dataset.filter((row) => row[feature] === value);
    const fraction = subset.length / total;
    weighted += fraction * entropy(subset.map((row) => row[labelKey]));
  }

  const infoGain = parentEntropy - weighted;
  const splitInfo = -values.reduce((totalValue, value) => {
    const subset = dataset.filter((row) => row[feature] === value);
    const ratio = subset.length / total;
    return totalValue + (ratio * Math.log2(ratio || 1));
  }, 0);

  return splitInfo === 0 ? 0 : infoGain / Math.abs(splitInfo);
}

export function buildDecisionTree(dataset, featureNames = []) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return { type: 'leaf', label: 'Sin datos', confidence: 0 };
  }

  const labels = [...new Set(dataset.map((item) => item.label))];
  if (labels.length === 1) {
    return { type: 'leaf', label: labels[0], confidence: 1 };
  }

  if (dataset.length <= 1) {
    return { type: 'leaf', label: dataset[0]?.label || 'Sin datos', confidence: 0.5 };
  }

  const availableFeatures = featureNames.length ? featureNames : Object.keys(dataset[0]).filter((key) => key !== 'label');
  if (availableFeatures.length === 0) {
    const labelCounts = labels.map((label) => ({
      label,
      count: dataset.filter((item) => item.label === label).length
    }));
    const majority = labelCounts.reduce((best, current) => current.count > best.count ? current : best);
    return {
      type: 'leaf',
      label: majority.label,
      confidence: majority.count / dataset.length
    };
  }

  let bestFeature = availableFeatures[0];
  let bestScore = -Infinity;

  for (const feature of availableFeatures) {
    const score = gainRatio(dataset, feature);
    if (score > bestScore) {
      bestFeature = feature;
      bestScore = score;
    }
  }

  const branches = {};
  const uniqueValues = [...new Set(dataset.map((row) => row[bestFeature]))];
  for (const value of uniqueValues) {
    const subset = dataset.filter((row) => row[bestFeature] === value);
    branches[String(value)] = buildDecisionTree(subset, availableFeatures.filter((feature) => feature !== bestFeature));
  }

  return {
    type: 'node',
    feature: bestFeature,
    branches,
    confidence: Math.max(...labels.map((label) => dataset.filter((row) => row.label === label).length / dataset.length))
  };
}

export function predictWithTree(tree, sample) {
  if (!tree || !sample) return 'Sin análisis';
  if (tree.type === 'leaf') return tree.label;

  const featureValue = sample[tree.feature];
  const branch = tree.branches[String(featureValue)];
  if (branch) {
    return predictWithTree(branch, sample);
  }

  const fallbackLabels = Object.values(tree.branches).map((branchNode) => branchNode.label || 'Sin análisis');
  return fallbackLabels[0] || 'Sin análisis';
}

export function getTreeConfidence(tree, sample) {
  if (!tree || !sample) return 0;
  if (tree.type === 'leaf') return tree.confidence || 0;

  const featureValue = sample[tree.feature];
  const branch = tree.branches[String(featureValue)];
  return branch ? getTreeConfidence(branch, sample) : tree.confidence || 0;
}

