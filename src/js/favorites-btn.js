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

// Check if an exercise is in favorites
function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

// Add exercise to favorites (зберігаємо тільки ID)
function addFavorite(exerciseObj) {
  const favorites = getFavorites();
  const exerciseId = exerciseObj.id || exerciseObj._id;
  if (exerciseId && !favorites.includes(exerciseId)) {
    favorites.push(exerciseId);
    saveFavorites(favorites);
  }
}

// Remove exercise from favorites
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

  updateButtonText(favoriteBtnElement, isInFavorites);
  const newBtn = favoriteBtnElement.cloneNode(true);
  favoriteBtnElement.parentNode.replaceChild(newBtn, favoriteBtnElement);

  newBtn.onclick = () => {
    const currentId = exercise.id || exercise._id;
    if (isFavorite(currentId)) {
      removeFavorite(currentId);
      updateButtonText(newBtn, false);
    } else {
      addFavorite(exercise);
      updateButtonText(newBtn, true);
    }
  };
}

function updateButtonText(button, isInFavorites) {
  const textNodes = Array.from(button.childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  );

  if (textNodes.length > 0) {
    textNodes[0].textContent = isInFavorites
      ? 'Remove from favorites'
      : 'Add to favorites';
  } else {
    const svg = button.querySelector('svg');
    const text = document.createTextNode(
      isInFavorites ? 'Remove from favorites' : 'Add to favorites'
    );
    if (svg) {
      button.insertBefore(text, svg);
    } else {
      button.appendChild(text);
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
