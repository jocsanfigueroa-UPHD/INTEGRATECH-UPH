export function bindControls(actionsMap) {
  const buttons = document.querySelectorAll('[data-action]');
  buttons.forEach((button) => {
    const action = button.dataset.action;
    const callback = actionsMap[action];
    if (callback) {
      button.addEventListener('click', callback);
    }
  });
}

