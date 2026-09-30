document.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('.ripple-btn');
  if (!button || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.addEventListener('animationend', () => ripple.remove());
  button.append(ripple);
});
