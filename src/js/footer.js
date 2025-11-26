import { VALIDATION, ERROR_MESSAGES } from './constants.js';
import { showSuccess, showError } from './iziToast-helper.js';
import { YourEnergyAPI } from './api.js';

const form = document.querySelector('.footer__form');

// Якщо на сторінці немає футера (наприклад, інша HTML-сторінка) — тихо виходимо
if (!form) {
  console.warn('Footer form not found on this page');
} else {
  const emailInput = form.querySelector('.footer__input');
  const api = new YourEnergyAPI();

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const email = emailInput.value.trim();

    // Валідація email
    if (!email) {
      showError(
        ERROR_MESSAGES?.EMAIL_REQUIRED || 'Please enter your email address'
      );
      return;
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      showError(
        ERROR_MESSAGES?.EMAIL_INVALID || 'Please enter a valid email address'
      );
      return;
    }

    try {
      // Використовуємо загальний API-клас
      await api.subscribe({ email });

      showSuccess(
        "We're excited to have you on board! 🎉 Thank you for subscribing to new exercises on Your Energy. You've just taken a significant step towards improving your fitness and well-being."
      );

      emailInput.value = '';
    } catch (error) {
      // Якщо бекенд повертає 409 / "exists", зручно показати окреме повідомлення
      const msg = error?.response?.data?.message || error?.message || '';

      if (msg.toLowerCase().includes('exists')) {
        showError('Subscription already exists');
      } else {
        showError(
          ERROR_MESSAGES?.API_ERROR || 'Server error, please try again later'
        );
      }

      console.error('Subscription error:', error);
    }
  });
}
