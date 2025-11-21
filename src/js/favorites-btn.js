import { REFS } from './constants.js';

const FAVORITES_KEY = 'favorites';

// Get favorites from LocalStorage
function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

// Save favorites to LocalStorage
function saveFavorites(favoritesArray) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
}

// Check if an exercise is in favorites
function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id);
}

// Add exercise to favorites
function addFavorite(exerciseObj) {
  const favorites = getFavorites();
  favorites.push(exerciseObj);
  saveFavorites(favorites);
}

// Remove exercise from favorites
function removeFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.filter(item => item.id !== id);
  saveFavorites(updated);
}

const currentExercise = {};

function initFavoritesBtn(exercise) {
  const favoriteBtnElement = REFS.favoriteBtn;

  if (!favoriteBtnElement) return;

  Object.assign(currentExercise, exercise);

  if (isFavorite(exercise.id)) {
    favoriteBtnElement.textContent = 'Remove from favorites';
  } else {
    favoriteBtnElement.textContent = 'Add to favorites';
  }

  favoriteBtnElement.onclick = () => {
    if (isFavorite(exercise.id)) {
      removeFavorite(exercise.id);
      favoriteBtnElement.textContent = 'Add to favorites';
    } else {
      addFavorite(exercise);
      favoriteBtnElement.textContent = 'Remove from favorites';
    }
  };
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
