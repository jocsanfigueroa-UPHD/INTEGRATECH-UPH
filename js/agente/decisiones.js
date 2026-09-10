export function decideAction(context = {}) {
  const { classification = 'Sin análisis', route = [], perception = {}, status = 'listo' } = context;

  if (perception.obstacleAhead) {
    return {
      kind: 'recalcular',
      label: 'Recalcular ruta',
      reason: 'Se detectó un obstáculo en la zona prevista.',
      priority: 'alta'
    };
  }

  if (!Array.isArray(route) || route.length === 0) {
    return {
      kind: 'recalcular',
      label: 'Recalcular ruta',
      reason: 'No hay ruta disponible para la misión en curso.',
      priority: 'alta'
    };
  }

  const sortedClassification = String(classification).toLowerCase();
  if (sortedClassification.includes('alta') || sortedClassification.includes('riesgo alto') || sortedClassification.includes('caso especial')) {
    return {
      kind: 'supervisar',
      label: 'Priorizar inspección',
      reason: 'Se prioriza la zona con mayor riesgo para evitar demora operativa.',
      priority: 'alta'
    };
  }

  if (sortedClassification.includes('media') || sortedClassification.includes('espera')) {
    return {
      kind: 'guiar',
      label: 'Continuar con control',
      reason: 'La condición requiere seguimiento y atención gradual.',
      priority: 'media'
    };
  }

  if (status === 'pausado') {
    return {
      kind: 'esperar',
      label: 'Esperar',
      reason: 'Sistema pausado para validar la siguiente decisión.',
      priority: 'baja'
    };
  }

  return {
    kind: 'mover',
    label: 'Mover al siguiente punto',
    reason: 'Se continúa con la ruta más eficiente según el plan vigente.',
    priority: 'baja'
  };
}

