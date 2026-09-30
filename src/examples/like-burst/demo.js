document.addEventListener('click', (event) => {
  const button = event.target.closest('.like-btn');
  if (!button) return;
  const liked = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!liked));
});
