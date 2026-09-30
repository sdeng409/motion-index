document.addEventListener('submit', (event) => {
  const form = event.target.closest('.shake-form');
  if (!form) return;
  event.preventDefault(); // 예제라서 실제 전송은 생략
  const invalid = !form.checkValidity();
  form.querySelector('input').setAttribute('aria-invalid', String(invalid));
  if (invalid) form.classList.add('is-shaking');
});

document.addEventListener('animationend', (event) => {
  if (event.animationName === 'shake-x') event.target.classList.remove('is-shaking');
});
