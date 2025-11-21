import { getFavorites, removeFavorite } from './favorites-btn.js';
import { REFS } from './constants.js';

function renderEmptyMessage() {
  REFS.favoritesList.innerHTML = `
    <div class="favorites-empty">
      <p>It appears that you haven’t added any exercises to your favorites yet.</p>
      <p>To get started, you can add exercises that you like to your favorites for easier access in the future.</p>
    </div>`;
}

function renderFavorites(arr) {
  REFS.favoritesList.innerHTML = '';

  arr.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('favorite-card');
    card.dataset.id = item.id;

    card.innerHTML = `
      <img src="${item.gifUrl}" alt="${item.name}" class="favorite-img">
      <h3 class="favorite-title">${item.name}</h3>
      <p class="favorite-info"><b>Target:</b> ${item.target}</p>
      <p class="favorite-info"><b>Body part:</b> ${item.bodyPart}</p>
      <p class="favorite-info"><b>Equipment:</b> ${item.equipment}</p>

      <button class="delete-btn" data-id="${item.id}">🗑</button>
    `;

    REFS.favoritesList.appendChild(card);

    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      removeFavorite(item.id);
      const updated = getFavorites();
      updated.length ? renderFavorites(updated) : renderEmptyMessage();
    });
  });
}

const favorites = getFavorites();
favorites.length ? renderFavorites(favorites) : renderEmptyMessage();
