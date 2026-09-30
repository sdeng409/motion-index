document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-flap-next]');
  if (!button) return;
  const flap = document.getElementById(button.dataset.flapNext);
  if (flap.classList.contains('is-flipping')) return;
  const current = Number(flap.dataset.value);
  const next = (current + 1) % 10;
  const [top, bottom, leafTop, leafBottom] = flap.children;
  top.textContent = next;
  bottom.textContent = current;
  leafTop.textContent = current;
  leafBottom.textContent = next;
  flap.dataset.value = next;
  flap.classList.add('is-flipping');
});

document.addEventListener('animationend', (event) => {
  if (event.animationName !== 'flap-bottom') return;
  const flap = event.target.parentElement;
  const [, bottom, leafTop] = flap.children;
  bottom.textContent = flap.dataset.value;
  leafTop.textContent = flap.dataset.value;
  flap.classList.remove('is-flipping');
});
