import { getFavorites, removeFavorite } from './favorites-btn.js';

const refs = {
  quoteContainer: document.querySelector('.favorites-wrapper .quote'),
  listContainer: document.querySelector('.favorites-list'),
};
const favorites = getFavorites();

if (favorites && refs.listContainer && favorites.length === 0) {
  refs.listContainer.innerHTML = `
    <div class="favorites-empty">
      <p>It appears that you haven’t added any exercises to your favorites yet.</p>
      <p>To get started, you can add exercises that you like to your favorites for easier access in the future.</p>
    </div>`;
} else if(Array.isArray(favorites) && refs.listContainer) {
  renderFavorites(favorites);
}

function renderFavorites(favorites) {
  refs.listContainer.innerHTML = '';

  favorites.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('favorite-card');
    card.setAttribute('data-id', item.id);

    card.innerHTML = `
      <img src="${item.gifUrl}" alt="${item.name}" class="favorite-img">
      <h3 class="favorite-title">${item.name}</h3>
      <p class="favorite-info"><b>Target:</b> ${item.target}</p>
      <p class="favorite-info"><b>Body part:</b> ${item.bodyPart}</p>
      <p class="favorite-info"><b>Equipment:</b> ${item.equipment}</p>

      <button class="delete-btn" data-id="${item.id}">🗑</button>
    `;

    refs.listContainer.appendChild(card);

    const deleteBtn = card.querySelector('.delete-btn');

    deleteBtn.addEventListener('click', () => {
      removeFavorite(item.id);
      const updated = getFavorites();
      renderFavorites(updated);
    });
  });
}
