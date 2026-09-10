export function updateDashboard(data) {
  const missionNameEl = document.getElementById('missionName');
  const stateNameEl = document.getElementById('stateName');
  const objectiveTextEl = document.getElementById('objectiveText');
  const actionCountEl = document.getElementById('actionCount');
  const costTotalEl = document.getElementById('costTotal');
  const replanCountEl = document.getElementById('replanCount');
  const positionTextEl = document.getElementById('positionText');
  const classificationTextEl = document.getElementById('classificationText');
  const confidenceTextEl = document.getElementById('confidenceText');
  const pathTextEl = document.getElementById('pathText');
  const historyTextEl = document.getElementById('historyText');
  const perceptionTextEl = document.getElementById('perceptionText');
  const decisionTextEl = document.getElementById('decisionText');
  const actionTextEl = document.getElementById('actionText');
  const logListEl = document.getElementById('logList');

  if (missionNameEl) missionNameEl.textContent = data.missionName || 'Biblioteca';
  if (stateNameEl) stateNameEl.textContent = data.stateName || 'Listo';
  if (objectiveTextEl) objectiveTextEl.textContent = data.objective ? `(${data.objective.x}, ${data.objective.y})` : '-';
  if (actionCountEl) actionCountEl.textContent = String(data.actionCount || 0);
  if (costTotalEl) costTotalEl.textContent = String(data.costTotal || 0);
  if (replanCountEl) replanCountEl.textContent = String(data.replanCount || 0);
  if (positionTextEl) positionTextEl.textContent = data.position ? `(${data.position.x}, ${data.position.y})` : '-';
  if (classificationTextEl) classificationTextEl.textContent = data.classification || 'Sin análisis';
  if (confidenceTextEl) confidenceTextEl.textContent = data.confidence || '0%';
  if (pathTextEl) pathTextEl.textContent = data.path || 'Sin ruta';
  if (historyTextEl) historyTextEl.textContent = data.history || 'Sin movimientos';
  if (perceptionTextEl) perceptionTextEl.textContent = data.perception || 'Esperando observación';
  if (decisionTextEl) decisionTextEl.textContent = data.decision || 'Sin decisión';
  if (actionTextEl) actionTextEl.textContent = data.action || 'Sin acción';

  if (logListEl && Array.isArray(data.log)) {
    logListEl.innerHTML = '';
    data.log.slice(0, 8).forEach((entry) => {
      const item = document.createElement('li');
      item.className = entry.level === 'warning' ? 'warning' : entry.level === 'danger' ? 'danger' : entry.level === 'success' ? 'success' : '';
      item.textContent = `[${entry.timestamp}] ${entry.message}`;
      logListEl.appendChild(item);
    });
  }
}

