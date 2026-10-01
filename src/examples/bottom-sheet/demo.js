document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-sheet-target]');
  if (trigger) {
    document.getElementById(trigger.dataset.sheetTarget).showModal();
    return;
  }
  // 안쪽 내용이 아니라 dialog 자체가 눌렸으면 바깥(backdrop)을 누른 것
  if (event.target.matches('.sheet')) event.target.close();
});

let drag = null;

document.addEventListener('pointerdown', (event) => {
  const handle = event.target.closest('.sheet-handle');
  if (!handle) return;
  handle.setPointerCapture(event.pointerId);
  const sheet = handle.closest('.sheet');
  sheet.classList.add('is-dragging');
  drag = { sheet, startY: event.clientY, lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 };
});

document.addEventListener('pointermove', (event) => {
  if (!drag) return;
  drag.velocity = (event.clientY - drag.lastY) / Math.max(event.timeStamp - drag.lastTime, 1);
  drag.lastY = event.clientY;
  drag.lastTime = event.timeStamp;
  drag.sheet.style.setProperty('--drag', `${Math.max(0, event.clientY - drag.startY)}px`);
});

function release(event) {
  if (!drag) return;
  const { sheet, startY, velocity } = drag;
  drag = null;
  sheet.classList.remove('is-dragging');
  sheet.style.removeProperty('--drag');
  // 높이의 1/3 넘게 끌었거나 아래로 빠르게(0.5px/ms 이상) 튕기면 닫음
  if (event.clientY - startY > sheet.offsetHeight / 3 || velocity > 0.5) sheet.close();
}

document.addEventListener('pointerup', release);
document.addEventListener('pointercancel', release);
