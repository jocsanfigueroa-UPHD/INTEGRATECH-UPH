export function renderMissionMenu(missions, selectedMissionId, onSelect) {
  const container = document.getElementById('missionMenu');
  if (!container) return;

  container.innerHTML = '';
  missions.forEach((mission) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `mission-item ${mission.id === selectedMissionId ? 'active' : ''}`;
    button.textContent = `${mission.name} · ${mission.label}`;
    button.addEventListener('click', () => onSelect(mission.id));
    container.appendChild(button);
  });
}

