document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-odometer-target]');
  if (!button) return;
  const odometer = document.getElementById(button.dataset.odometerTarget);
  const digits = [...odometer.querySelectorAll('.odo-digit')];
  const min = 10 ** (digits.length - 1);
  const value = min + Math.floor(Math.random() * 9 * min);
  const text = String(value);
  digits.forEach((digit, index) => digit.style.setProperty('--d', text[index]));
  odometer.setAttribute('aria-label', `${value.toLocaleString('ko-KR')}원`);
});
