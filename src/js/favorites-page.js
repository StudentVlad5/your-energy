import { getFavorites, removeFavorite } from './favorites-btn.js';
import { YourEnergyAPI } from './api.js';
import { renderExercisesList } from '../js/exercises-list';
import { renderPaginationUniversal } from './pagination.js';
import { cancelLoader, startLoader } from './loader.js';

const api = new YourEnergyAPI();

let currentPage = 1;
let allFavoritesData = [];

function isDesktop() {
  return window.innerWidth >= 1440;
}

function getItemsPerPage() {
  if (window.innerWidth >= 768) {
    return 10;
  }
  return 8;
}

function renderEmptyMessage() {
  const wrapper = document.querySelector('.favorites-wrapper');
  if (!wrapper) return;

  const existingContent = wrapper.querySelector('.favorites-content');
  if (existingContent) existingContent.remove();

  const existingEmpty = wrapper.querySelector('.favorites-empty');
  if (existingEmpty) existingEmpty.remove();

  let mainContainer = wrapper.querySelector('.main-container');
  if (!mainContainer) {
    mainContainer = document.createElement('div');
    mainContainer.className = 'main-container container';
    wrapper.appendChild(mainContainer);
  }

  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'favorites-empty';
  emptyDiv.innerHTML = `
    <p>It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>
  `;

  mainContainer.appendChild(emptyDiv);
}

async function loadFavoritesData(ids) {
  try {
    const exercise = await api.getExerciseById(ids);
    if (exercise) return exercise;
  } catch (err) {
    console.error(`Failed to load exercise ${ids}`, err);
  }
}

function renderPaginatedFavorites(page = 1) {
  const container = document.querySelector('.main-container');
  if (!container) return;

  let contentWrapper = container.querySelector('.favorites-content');
  if (!contentWrapper) {
    contentWrapper = document.createElement('div');
    contentWrapper.className = 'favorites-content';
    container.appendChild(contentWrapper);
  }

  let listEl = contentWrapper.querySelector('.favorites-list');
  if (!listEl) {
    listEl = document.createElement('ul');
    listEl.className = 'favorites favorites-list';
    contentWrapper.appendChild(listEl);
  }

  let paginationContainer = contentWrapper.querySelector(
    '.js-favorites-pagination'
  );
  if (!paginationContainer) {
    paginationContainer = document.createElement('div');
    paginationContainer.className =
      'favorites-pagination js-favorites-pagination';
    contentWrapper.appendChild(paginationContainer);
  }

  // ----------------------------------------
  // 🔥 DESKTOP PAGINATION (12 per page)
  // ----------------------------------------
  if (isDesktop()) {
    const desktopLimit = 12;
    const totalPages = Math.ceil(allFavoritesData.length / desktopLimit);
    const needsPagination = totalPages > 1;

    const startIndex = (page - 1) * desktopLimit;
    const endIndex = startIndex + desktopLimit;

    const paginatedDesktop = allFavoritesData.slice(startIndex, endIndex);
    renderExercisesList(listEl, paginatedDesktop, true);

    if (needsPagination) {
      renderPaginationUniversal({
        container: paginationContainer,
        currentPage: page,
        totalPages: totalPages,
        mode: 'neighbors',
        showPrevNext: totalPages > 2,
        classes: {
          page: 'exercises__page',
          active: 'active',
          prev: 'exercises__page-prev',
          next: 'exercises__page-next',
        },
        icons: {
          prev: '<',
          next: '>',
        },
        scrollToTop: true,
        scrollTarget: '.favorites-wrapper',
        onPageChange(newPage) {
          currentPage = newPage;
          renderPaginatedFavorites(newPage);
        },
      });
    } else {
      paginationContainer.innerHTML = '';
    }

    return;
  }

  // ----------------------------------------
  // 📱 MOBILE/TABLET (8/10 per page)
  // ----------------------------------------
  const itemsPerPage = getItemsPerPage();
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = allFavoritesData.slice(startIndex, endIndex);
  renderExercisesList(listEl, paginatedData, true);

  const totalPages = Math.ceil(allFavoritesData.length / itemsPerPage);

  if (totalPages > 1) {
    renderPaginationUniversal({
      container: paginationContainer,
      currentPage: page,
      totalPages: totalPages,
      mode: 'neighbors',
      showPrevNext: totalPages > 2,
      classes: {
        page: 'exercises__page',
        active: 'active',
        prev: 'exercises__page-prev',
        next: 'exercises__page-next',
      },
      icons: {
        prev: '<',
        next: '>',
      },
      scrollToTop: true,
      scrollTarget: '.favorites-wrapper',
      onPageChange(newPage) {
        currentPage = newPage;
        renderPaginatedFavorites(newPage);
      },
    });
  } else {
    paginationContainer.innerHTML = '';
  }
}

async function renderFavorites(arr) {
  const container = document.querySelector('.favorites-wrapper');
  if (!container) return;

  const emptyDiv = container.querySelector('.favorites-empty');
  if (emptyDiv) emptyDiv.remove();

  allFavoritesData = [];

  if (Array.isArray(arr) && arr.length > 0) {
    try {
      const promises = arr.map(it => loadFavoritesData(it.trim()));
      const results = await Promise.all(promises);
      results.forEach(data => {
        if (data) allFavoritesData.push(data);
      });
    } catch (error) {
      console.error('Error loading:', error);
    }
  }

  if (allFavoritesData.length === 0) {
    renderEmptyMessage();
    return;
  }

  currentPage = 1;
  renderPaginatedFavorites(1);
}

export function startRenderFavorites() {
  const favorites = getFavorites();
  favorites.length ? renderFavorites(favorites) : renderEmptyMessage();
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (allFavoritesData.length > 0) {
      renderPaginatedFavorites(currentPage);
    }
  }, 250);
});

const wrapper = document.querySelector('.favorites-wrapper');

if (wrapper) {
  wrapper.addEventListener('click', event => {
    const deleteBtn = event.target.closest('.favorites-delete-btn');

    if (deleteBtn) {
      const idToRemove = deleteBtn.dataset.id;

      if (idToRemove) {
        if (wrapper.style.pointerEvents === 'none') return;
        wrapper.style.pointerEvents = 'none';

        startLoader();
        removeFavorite(idToRemove);
        startRenderFavorites();
        cancelLoader();

        setTimeout(() => {
          wrapper.style.pointerEvents = 'auto';
        }, 500);
      }
    }
  });
}

startRenderFavorites();
