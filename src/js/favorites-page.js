import { getFavorites, removeFavorite } from './favorites-btn.js';
import { YourEnergyAPI } from './api.js';
import { REFS } from './constants.js';
import { createExerciseCard } from './exercises-list.js';

const api = new YourEnergyAPI();

function renderEmptyMessage() {
  REFS.favoritesList.innerHTML = `
    <div class="favorites-empty">
      <p>It appears that you haven’t added any exercises to your favorites yet.</p>
      <p>To get started, add exercises that you like to your favorites for easier access.</p>
    </div>`;
}

async function loadFavoritesData(ids) {
  const results = [];

  for (const id of ids) {
    try {
      const exercise = await api.getExerciseById(id);
      if (exercise) results.push(exercise);
    } catch (err) {
      console.error(`Failed to load exercise ${id}`, err);
    }
  }
  return results;
}

function renderFavorites(arr) {
  REFS.favoritesList.innerHTML = '';

  arr.forEach(item => {
    const cardHTML = createExerciseCard(item);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = cardHTML.trim();
    const cardElement = wrapper.firstElementChild;

    const deleteBtn = cardElement.querySelector('.favorites-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        removeFavorite(item.id);
        updateFavoritesPage();
      });
    }

    REFS.favoritesList.appendChild(cardElement);
  });
}

const favorites = getFavorites();
if (REFS.favoritesList)
  favorites.length ? renderFavorites(favorites) : renderEmptyMessage();
