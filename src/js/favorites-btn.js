import { REFS } from './constants.js';

const FAVORITES_KEY = 'favorites';

// --- LocalStorage helpers ---
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function addFavorite(exercise) {
  const id = exercise.id || exercise._id;
  if (!id) return;

  const list = getFavorites();
  if (!list.includes(id)) {
    list.push(id);
    saveFavorites(list);
  }
}

function removeFavorite(id) {
  const list = getFavorites().filter(item => item !== id);
  saveFavorites(list);
}

// --- Update button UI ---
function updateButton(button, isAdded) {
  button.classList.toggle('added', isAdded);

  button.innerHTML = `
    <span>${isAdded ? 'Remove from favorites' : 'Add to favorites'}</span>
    <svg class="exercise-modal__btn-icon">
      <use href="./img/icons.svg#${
        isAdded ? 'icon-heart-full' : 'icon-heart-empty'
      }"></use>
    </svg>
  `;
}

// --- Init favorite button in modal ---
export function initFavoritesBtn(exercise, btn = null) {
  const button = btn || REFS.favoriteBtn;
  if (!button) return;

  const id = exercise.id || exercise._id;

  updateButton(button, isFavorite(id));

  button.onclick = () => {
    if (isFavorite(id)) {
      removeFavorite(id);
      updateButton(button, false);
    } else {
      addFavorite(exercise);
      updateButton(button, true);
    }
  };
}

export { getFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite };
