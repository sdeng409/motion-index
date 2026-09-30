document.addEventListener('click', (event) => {
  const button = event.target.closest('.morph-toggle');
  if (!button) return;
  const playing = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!playing));
  button.setAttribute('aria-label', playing ? '재생' : '일시정지');
});
