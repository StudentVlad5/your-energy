import { getFavorites, removeFromFavorites } from './favorites-btn.js';
import { fetchExerciseById } from './api.js';
import { createExerciseCard } from './exercises-list.js';
import { REFS } from './constants.js';

async function renderFavorites() {
  const favoritesIds = getFavorites();

  if (!favoritesIds.length) {
    REFS.favoritesSection.innerHTML = `
      <p class="favorites-empty">Your favorites list is empty.</p>
    `;
    return;
  }

  REFS.favoritesSection.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (const id of favoritesIds) {
    try {
      const exercise = await fetchExerciseById(id);

      const card = createExerciseCard(exercise);

      card.classList.add('from-favorites');

      const deleteBtn = card.querySelector('.exercise-card__delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          removeFromFavorites(id);
          renderFavorites();
        });
      }

      fragment.appendChild(card);
    } catch (error) {
      console.error(`Ошибка загрузки упражнения id=${id}`, error);
    }
  }

  REFS.favoritesSection.appendChild(fragment);
}

export function initFavoritesPage() {
  renderFavorites();
}
