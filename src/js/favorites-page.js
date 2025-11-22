import { getFavorites, removeFavorite } from './favorites-btn.js';
import { YourEnergyAPI } from './api.js';
import { REFS } from './constants.js';
import { renderExercisesList } from '../js/exercises-list';

const api = new YourEnergyAPI();

function renderEmptyMessage() {
  REFS.favoritesList.innerHTML = `
    <li class="favorites-empty">
      <p>It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>
    </li>`;
}

async function loadFavoritesData(ids) {
  try {
    const exercise = await api.getExerciseById(ids);
    if (exercise) return exercise;
  } catch (err) {
    console.error(`Failed to load exercise ${id}`, err);
  }
}

async function renderFavorites(arr) {
  const listFavoritesExcecises = [];

  if (Array.isArray(arr) && arr.length > 0) {
    try {
      const promises = arr.map(it => loadFavoritesData(it.trim()));
      const results = await Promise.all(promises);

      results.forEach(data => {
        if (data) {
          listFavoritesExcecises.push(data);
        }
      });
    } catch (error) {
      console.error('Error loading:', error);
    }
  }
  renderExercisesList(REFS.favoritesList, listFavoritesExcecises, true);
  REFS.favoritesList.addEventListener('click', event => {
    const deleteBtn = event.target.closest('.favorites-delete-btn');
    if (deleteBtn) {
      const idToRemove = deleteBtn.dataset.id;
      if (idToRemove) {
        removeFavorite(idToRemove);
        startRenderFavorites();
      }
    }
  });
}

export function startRenderFavorites() {
  const favorites = getFavorites();
  if (REFS.favoritesList)
    favorites.length ? renderFavorites(favorites) : renderEmptyMessage();
}

startRenderFavorites();
