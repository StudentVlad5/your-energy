import { REFS } from './constants.js';

const FAVORITES_KEY = 'favorites';

// Get favorites from LocalStorage
function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  if (!data) return [];

  const parsed = JSON.parse(data);

  if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].id) {
    const ids = parsed.map(item => item.id || item._id).filter(Boolean);
    saveFavorites(ids);
    return ids;
  }

  return parsed;
}

// Save favorites to LocalStorage
function saveFavorites(favoritesArray) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
}

function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

function addFavorite(exerciseObj) {
  const favorites = getFavorites();
  const exerciseId = exerciseObj.id || exerciseObj._id;
  if (exerciseId && !favorites.includes(exerciseId)) {
    favorites.push(exerciseId);
    saveFavorites(favorites);
  }
}

function removeFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.filter(itemId => itemId !== id);
  saveFavorites(updated);
}

const currentExercise = {};

function initFavoritesBtn(exercise, buttonElement = null) {
  const favoriteBtnElement = buttonElement || REFS.favoriteBtn;

  if (!favoriteBtnElement) return;

  Object.assign(currentExercise, exercise);

  const exerciseId = exercise.id || exercise._id;
  const isInFavorites = isFavorite(exerciseId);

  updateButtonState(favoriteBtnElement, isInFavorites);

  favoriteBtnElement.onclick = () => {
    const currentId = exercise.id || exercise._id;
    if (isFavorite(currentId)) {
      removeFavorite(currentId);
      updateButtonState(favoriteBtnElement, false);
    } else {
      addFavorite(exercise);
      updateButtonState(favoriteBtnElement, true);
    }
  };
}

function updateButtonState(button, isInFavorites) {
  const textElement = button.querySelector('.exercise-modal__btn-text');
  const heartIcon = button.querySelector('.exercise-modal__btn-icon--heart');
  const trashIcon = button.querySelector('.exercise-modal__btn-icon--trash');

  if (textElement) {
    textElement.textContent = isInFavorites
      ? 'Remove from favorites'
      : 'Add to favorites';
  }

  if (heartIcon && trashIcon) {
    if (isInFavorites) {
      heartIcon.classList.add('exercise-modal__btn-icon--hidden');
      trashIcon.classList.remove('exercise-modal__btn-icon--hidden');
    } else {
      heartIcon.classList.remove('exercise-modal__btn-icon--hidden');
      trashIcon.classList.add('exercise-modal__btn-icon--hidden');
    }
  }
}

export {
  getFavorites,
  saveFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  currentExercise,
  initFavoritesBtn,
};
