import { showError } from './iziToast-helper';
import { injectSchema } from './seo-function';
import { handleCategoryCardClick } from './categories-card-click';
import { cancelLoader, startLoader } from './loader';
import { YourEnergyAPI } from './api';
import { renderPaginationUniversal } from './pagination';

export const fetchApi = new YourEnergyAPI();

const PAGE_LIMIT = window.innerWidth < 768 ? 9 : 12;

// UI state
let activeFilter = 'Muscles';
let activePage = 1;

// ЄДИНИЙ контейнер
const CARDS_CONTAINER_ID = 'cards-container';
const PAGINATION_SELECTOR = '.js-categories-pagination';

// 🆕 допоміжна функція: назва фільтра → ключ табу (data-filter)
function getTabKeyFromFilter(filter) {
  switch (filter) {
    case 'Muscles':
      return 'muscles';
    case 'Equipment':
      return 'equipment';
    case 'Body parts':
      return 'bodypart';
    default:
      return 'muscles';
  }
}

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

// Cards ----------------------------------------------------------------------

function renderCards(items) {
  const container = document.getElementById(CARDS_CONTAINER_ID);
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

    // перехід на exercises
    card.addEventListener('click', handleCategoryCardClick(item));

    container.appendChild(card);
  });
}

// Pagination -----------------------------------------------------------------

function renderPagination(currentPage, totalPages) {
  const container = document.querySelector(PAGINATION_SELECTOR);
  if (!container) return;

  renderPaginationUniversal({
    container,
    currentPage,
    totalPages,
    mode: 'neighbors',
    showPrevNext: totalPages > 2,
    showArrows: totalPages >= 3,

    classes: {
      page: 'exercises__page',
      active: 'active',
      prev: 'exercises__page-prev',
      next: 'exercises__page-next',
      first: 'exercises__page-first',
      last: 'exercises__page-last',
      arrow: 'exercises__page-arrow',
    },

    icons: {
      prev: '<',
      next: '>',
      first: '<<',
      last: '>>',
    },

    scrollToTop: true,
    scrollTarget: '.main-container',

    // 🆕 тут додаємо історію для пагінації категорій
    onPageChange(page) {
      activePage = page;

      // визначаємо tab (muscles/equipment/bodypart) з activeFilter
      const tabKey = getTabKeyFromFilter(activeFilter);

      const url = new URL(location.href);
      url.searchParams.set('tab', tabKey);
      url.searchParams.set('page', String(page));

      // кладемо в history стейт тільки для категорій
      history.pushState(
        {
          tab: tabKey,
          page,
        },
        '',
        url
      );

      // як і раніше — вантажимо потрібну сторінку
      return getCategories(activeFilter, page, PAGE_LIMIT);
    },
  });
}

// Helpers --------------------------------------------------------------------

function clearCards() {
  const container = document.getElementById(CARDS_CONTAINER_ID);
  if (container) container.innerHTML = '';
}

function clearPagination() {
  const container = document.querySelector(PAGINATION_SELECTOR);
  if (container) container.innerHTML = '';
}
