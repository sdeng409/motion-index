document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.accordion-trigger');
  if (!trigger) return;
  const expanded = trigger.getAttribute('aria-expanded') === 'true';
  trigger.setAttribute('aria-expanded', String(!expanded));
});
