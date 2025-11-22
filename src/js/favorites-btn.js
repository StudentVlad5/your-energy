const FAVORITES_KEY = 'favorites_exercises';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function addToFavorites(id) {
  const ids = getFavorites();
  if (!ids.includes(id)) {
    ids.push(id);
    saveFavorites(ids);
  }
}

export function removeFromFavorites(id) {
  const ids = getFavorites().filter(favId => favId !== id);
  saveFavorites(ids);
}

export function initFavoritesBtn(exercise) {
  const btn = document.querySelector('.exercise-modal__btn--favorites');
  if (!btn) return;

  function updateBtn() {
    const added = isFavorite(exercise._id);

    btn.classList.toggle('added', added);

    btn.textContent = added ? 'Remove from favorites' : 'Add to favorites';
  }

  updateBtn();

  btn.addEventListener('click', () => {
    const added = isFavorite(exercise._id);

    if (added) {
      removeFromFavorites(exercise._id);
    } else {
      addToFavorites(exercise._id);
    }

    updateBtn();
  });
}
