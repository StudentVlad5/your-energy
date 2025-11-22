import { YourEnergyAPI } from './api.js';
import { initFavoritesBtn } from './favorites-btn.js';
import { showError } from './iziToast-helper.js';
import { initModalButtons } from './modal-template.js';

const api = new YourEnergyAPI();

export function getExerciseModalContent() {
  const modalTemplate = document.getElementById('exercise-modal-template');

  if (!modalTemplate) {
    console.error(
      'Exercise modal template not found. Ensure modal-exercise.html is loaded via <load> tag.'
    );
    return null;
  }

  const fragment = modalTemplate.content.cloneNode(true);
  const content = fragment.firstElementChild || fragment.firstChild;

  if (!content) {
    console.error('Failed to extract content from template fragment');
    return null;
  }

  return content;
}

export async function initExerciseModal(closeModalFn) {
  const modalBody = document.querySelector('[data-modal-body]');
  const modal = modalBody?.querySelector('.exercise-modal');

  if (!modalBody || !modal) {
    console.error('Modal body or exercise modal not found');
    return;
  }

  const loader = modal.querySelector('.exercise-modal__loader');
  if (loader) {
    loader.classList.remove('hidden');
  }

  let exerciseId =
    sessionStorage.getItem('exerciseModalExerciseId') ||
    document
      .querySelector('[data-modal="exercise"][data-exercise-id]')
      ?.getAttribute('data-exercise-id');

  if (exerciseId) {
    sessionStorage.removeItem('exerciseModalExerciseId');
  }

  if (!exerciseId) {
    if (loader) loader.classList.add('hidden');
    showError('Exercise ID is missing');
    return;
  }

  let exercise;
  try {
    exercise = await api.getExerciseById(exerciseId);
    exercise.id = exercise.id || exercise._id;
  } catch (err) {
    console.error('Failed to load exercise:', err);
    if (loader) loader.classList.add('hidden');
    showError(err.message || 'Failed to load exercise. Try later.');
    modal.innerHTML = `<p>Failed to load exercise. Try later.</p>`;
    return;
  }

  renderExerciseData(modal, exercise);

  if (loader) {
    loader.classList.add('hidden');
  }

  const favoritesBtn = modal.querySelector('.favorites-btn');
  if (favoritesBtn) {
    initFavoritesBtn(exercise, favoritesBtn);
  }

  const ratingBtn = modal.querySelector('.exercise-modal__btn--rating');
  if (ratingBtn && !ratingBtn.hasAttribute('data-modal-initialized')) {
    initModalButtons();
  }
}

function renderExerciseData(container, exercise) {
  const titleEl = container.querySelector('.exercise-modal__title');
  const ratingValueEl = container.querySelector(
    '.exercise-modal__rating-value'
  );
  const starsContainer = container.querySelector('.exercise-modal__stars');
  const gifEl = container.querySelector('.exercise-modal__gif');
  const targetEl = container.querySelector('.exercise-modal__target');
  const bodypartEl = container.querySelector('.exercise-modal__bodypart');
  const equipmentEl = container.querySelector('.exercise-modal__equipment');
  const popularEl = container.querySelector('.exercise-modal__popular');
  const caloriesEl = container.querySelector('.exercise-modal__calories');
  const descriptionEl = container.querySelector('.exercise-modal__description');
  const favoritesBtn = container.querySelector('.favorites-btn');
  const ratingBtn = container.querySelector('.exercise-modal__btn--rating');

  // Title
  if (titleEl) titleEl.textContent = exercise.name || '';

  // Rating
  const rating = exercise.rating || 0;
  if (ratingValueEl) {
    ratingValueEl.textContent = rating.toFixed(1);
  }
  if (starsContainer) {
    starsContainer.innerHTML = renderStars(rating);
  }

  // GIF
  if (gifEl) {
    gifEl.src = exercise.gifUrl || '';
    gifEl.alt = exercise.name || 'Exercise GIF';
  }

  // Info
  if (targetEl) targetEl.textContent = capitalizeFirst(exercise.target || '');
  if (bodypartEl)
    bodypartEl.textContent = capitalizeFirst(exercise.bodyPart || '');
  if (equipmentEl)
    equipmentEl.textContent = capitalizeFirst(exercise.equipment || '');

  // Popular
  if (popularEl) {
    const popularity = exercise.popularity || 0;
    if (popularity >= 1000) {
      popularEl.textContent =
        (popularity / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      popularEl.textContent = popularity.toString();
    }
  }

  // Calories
  if (caloriesEl) {
    const calories = exercise.burnedCalories;
    const caloriesContainer = caloriesEl.closest('p');

    if (calories && calories > 0) {
      const time = exercise.time || 3;
      caloriesEl.textContent = `${calories}/${time} min`;
      if (caloriesContainer) {
        caloriesContainer.style.display = '';
      }
    } else {
      if (caloriesContainer) {
        caloriesContainer.style.display = 'none';
      }
    }
  }

  // Description
  if (descriptionEl) {
    descriptionEl.textContent =
      exercise.description || exercise.instructions || '';
  }

  // Buttons
  if (favoritesBtn) {
    favoritesBtn.setAttribute('data-id', exercise.id || exercise._id || '');
  }

  if (ratingBtn) {
    ratingBtn.setAttribute(
      'data-exercise-id',
      exercise.id || exercise._id || ''
    );
  }
}

function renderStars(rating) {
  const roundedRating = Math.round(rating);
  const fullStars = roundedRating;
  const emptyStars = 5 - fullStars;

  let starsHTML = '';

  const starPath =
    'M5.53234 0.690968C5.83169 -0.230342 7.1351 -0.230343 7.43445 0.690968L8.27951 3.29178C8.41338 3.7038 8.79734 3.98276 9.23057 3.98276H11.9652C12.9339 3.98276 13.3367 5.22238 12.553 5.79178L10.3406 7.39917C9.99014 7.65381 9.84348 8.10518 9.97735 8.5172L10.8224 11.118C11.1218 12.0393 10.0673 12.8055 9.28357 12.2361L7.07118 10.6287C6.7207 10.374 6.2461 10.374 5.89561 10.6287L3.68323 12.2361C2.89952 12.8055 1.84504 12.0393 2.14439 11.118L2.98944 8.51721C3.12332 8.10518 2.97666 7.65381 2.62617 7.39917L0.41379 5.79178C-0.369924 5.22238 0.0328507 3.98276 1.00157 3.98276H3.73623C4.16946 3.98276 4.55341 3.7038 4.68729 3.29178L5.53234 0.690968Z';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `
      <div class="rating-star active">
        <svg
          width="18"
          height="18"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="rating-star__svg"
        >
          <path
            d="${starPath}"
            class="rating-star__path"
          />
        </svg>
      </div>
    `;
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `
      <div class="rating-star">
        <svg
          width="18"
          height="18"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="rating-star__svg"
        >
          <path
            d="${starPath}"
            class="rating-star__path"
          />
        </svg>
      </div>
    `;
  }

  return starsHTML;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
