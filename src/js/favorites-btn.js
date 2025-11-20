const FAVORITES_KEY = 'favorites';

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favoritesArray) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
}

function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id);
}

function addFavorite(exerciseObj) {
  const favorites = getFavorites();
  favorites.push(exerciseObj);
  saveFavorites(favorites);
}

function removeFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.filter(item => item.id !== id);
  saveFavorites(updated);
}

const refs = {
  favoriteBtnElement: document.querySelector('.favorites-btn'),
};

const currentExercise = {};

export {
  getFavorites,
  saveFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  refs,
  currentExercise,
};
