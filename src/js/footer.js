import { VALIDATION } from './constants.js';
import { showSuccess, showError, showInfo } from './iziToast-helper.js';
const form = document.querySelector('.footer__form');
const emailInput = form.querySelector('.footer__input');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const email = emailInput.value.trim();

  if (!email || !VALIDATION.EMAIL_REGEX.test(email)) {
    return;
  }

  try {
    const response = await fetch(
      'https://your-energy.b.goit.study/api/subscription',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      showSuccess(
        "We're excited to have you on board! 🎉 Thank you for subscribing to new exercises on Your Energy. You've just taken a significant step towards improving your fitness and well-being."
      );
      emailInput.value = '';
    } else {
      const data = await response.json();
      showError('Subscription already exists');
    }
  } catch (error) {
    showError('Server error');
  }
});
