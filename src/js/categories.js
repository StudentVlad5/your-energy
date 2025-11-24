import { showError } from './iziToast-helper';
import { injectSchema } from './seo-function';
import { handleCategoryCardClick } from './categories-card-click';
import { cancelLoader, startLoader } from './loader';
import { YourEnergyAPI } from './api';
import { renderPaginationUniversal } from './pagination';
import { loadExercisesList } from './exercises-list.js';
import { setOpenExercises } from './state.js';
import { resetExercisesSearch } from './exercises-search';
import { scrollToFilter } from './scrollToFilter';

export const fetchApi = new YourEnergyAPI();

const PAGE_LIMIT = window.innerWidth < 768 ? 9 : 12;

// UI state
// activeFilter: 'Muscles', 'Equipment', 'Body parts'
//let activeFilter = 'Muscles';
let activeFilter = window.activeFilter || 'Muscles';
let activePage = 1;

export async function getCategories(
  filter = activeFilter,
  page = 1,
  limit = PAGE_LIMIT
) {
  activeFilter = filter;
  window.activeFilter = activeFilter;
  activePage = page;

  try {
    const params = { filter, page, limit };
    startLoader();
    const data = await fetchApi.getFilters(params);

    if (!data) {
      showError('Failed to fetch categories: No response from server');
      clearCards();
      clearPagination();
      return;
    }

    if (data.error || data.status === 'error') {
      showError(data.message || 'Failed to fetch categories');
      clearCards();
      clearPagination();
      return;
    }

    if (!data.results || data.results.length === 0) {
      showError('Nothing found');
      clearCards();
      clearPagination();
      return;
    }

    const results = data.results || [];
    const totalPages = data.totalPages || 1;

    renderCards(results);
    renderPagination(activePage, totalPages);

    if (typeof injectSchema === 'function') {
      injectSchema(data);
    }
  } catch (err) {
    console.error('getCategories error:', err);
    showError(err?.message || 'Something went wrong');
    clearCards();
    clearPagination();
  } finally {
    cancelLoader();
  }
}

// Cards
function renderCards(items) {
  let cardsContainerId = 'cards-container';
  //console.log('window.activeFilter in renderCards', window.activeFilter);

  switch (window.activeFilter) {
    case 'Muscles':
      cardsContainerId = 'cards-container';
      break;
    case 'Equipment':
      cardsContainerId = 'cards-container-equipment';
      break;
    case 'Body parts':
      cardsContainerId = 'cards-container';
      break;
    default:
      cardsContainerId = 'cards-container'; // Значення за замовчуванням
  }
  console.log('cardsContainerId :', cardsContainerId);
  const container = document.getElementById(cardsContainerId);
  //const container = document.getElementById('cards-container');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const safeImg =
      item.imgURL && item.imgURL.trim() !== ''
        ? item.imgURL
        : '/img/no-image.jpg';

    const safeName = item.name || '';
    const safeFilter = item.filter || '';

    card.innerHTML = `
      <img src="${safeImg}" alt="${safeName}" loading="lazy" />
      <div class="card-body">
        <h3>${safeName}</h3>
        <span>${safeFilter}</span>
      </div>
    `;

    // handleCategoryCardClick;
    card.addEventListener('click', () => handleCategoryCardClick(item));
    container.appendChild(card);

    const cardBody = card.querySelector('.card-body');
    cardBody.addEventListener('click', () => {
      onCardBodyClick(safeName);
    });
  });
}

// Pagination
function renderPagination(currentPage, totalPages) {
  const container = document.getElementById('pagination');
  if (!container) return;

  renderPaginationUniversal({
    container,
    currentPage,
    totalPages,
    mode: 'neighbors',

    showPrevNext: totalPages > 2,
    showArrows: totalPages > 3,

    classes: {
      page: 'pagination-page',
      active: 'active',
      prev: 'pagination-page-prev',
      next: 'pagination-page-next',
    },

    icons: {
      prev: '<',
      next: '>',
    },

    scrollToTop: false,
    onPageChange(page) {
      activePage = page;
      scrollToFilter();
      return getCategories(activeFilter, page, PAGE_LIMIT);
    },
  });
}

// Clear Helpers
function clearCards() {
  const container = document.getElementById('cards-container');
  if (container) container.innerHTML = '';
}

function clearPagination() {
  const container = document.getElementById('pagination');
  if (container) container.innerHTML = '';
}

export function onCardBodyClick(nameValue) {
  const searchBox = document.querySelector('.filters__search');
  const categoriesBox = document.getElementById('cards-box');
  const exercisesBox = document.getElementById('exercises');

  const tabsContainer = document.querySelector('[data-filters-tabs]');
  const activeTab = tabsContainer.querySelector('.filters__tab--active');
  const activeFilterType = activeTab ? activeTab.dataset.filter : null;

  if (categoriesBox) categoriesBox.classList.add('hidden');
  if (exercisesBox) exercisesBox.classList.remove('hidden');

  setOpenExercises(true);
  if (searchBox) searchBox.classList.add('filters__search--visible');

  const filtersSubtitle = document.querySelector('.filters__subtitle');
  if (filtersSubtitle) {
    filtersSubtitle.textContent =
      nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
  } else {
    filtersSubtitle.textContent = '';
  }

  resetExercisesSearch();
  scrollToFilter();
  loadExercisesList({
    page: 1,
    filter: nameValue,
    type: activeFilterType,
    keyword: '', // <-- критично
  });
}

getCategories(activeFilter, activePage, PAGE_LIMIT);
