const form = document.querySelector('.footer__form');
const emailInput = form.querySelector('.footer__input');
const messageEl = form.querySelector('.footer__message');

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

form.addEventListener('submit', async event => {
  event.preventDefault();

  const email = emailInput.value.trim();

  if (!emailPattern.test(email)) {
    messageEl.textContent = 'Please enter a valid email.';
    messageEl.classList.remove('footer__message--success');
    messageEl.classList.add('footer__message--error');
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
      messageEl.textContent = 'Subscription successful!';
      messageEl.classList.remove('footer__message--error');
      messageEl.classList.add('footer__message--success');

      emailInput.value = '';
    } else {
      const data = await response.json();

      messageEl.textContent = data.message || 'Subscription failed.';
      messageEl.classList.remove('footer__message--success');
      messageEl.classList.add('footer__message--error');
    }
  } catch (error) {
    messageEl.textContent = 'Network error. Try again later.';
    messageEl.classList.remove('footer__message--success');
    messageEl.classList.add('footer__message--error');
  }
});
