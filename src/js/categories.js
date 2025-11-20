import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper';
import { injectSchema } from './seo-function';

export const fetchApi = new YourEnergyAPI();

const PAGE_LIMIT = window.innerWidth < 768 ? 9 : 12;

// UI state
let activeFilter = 'Muscles';
let activePage = 1;

// Fetch categories from API and render cards + pagination.

async function getCategories(
  filter = activeFilter,
  page = 1,
  limit = PAGE_LIMIT
) {
  // Update UI state early
  activeFilter = filter;
  activePage = page;

  try {
    const params = { filter, page, limit };
    const data = await fetchApi.getFilters(params);

    // Validate expected structure
    if (!data) {
      return showError('Data is empty');
    }

    // Render UI
    renderCards(data.results || []);
    renderPagination(activePage, data.totalPages || 1);

    // Optional: ensure data is structured before injecting
    if (typeof injectSchema === 'function') {
      injectSchema(data);
    }
  } catch (err) {
    console.error('getCategories error:', err);
    showError(err?.message || 'Something went wrong');
  }
}

// Cards

function renderCards(items) {
  const container = document.getElementById('cards-container');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${item.imgURL}" alt="${item.name}" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <span class="card-filter">${item.filter}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// Pagination

function renderPagination(currentPage, totalPages) {
  const container = document.getElementById('pagination');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageNum = i;
    const btn = document.createElement('button');

    btn.textContent = pageNum;
    btn.className = 'pagination-page';
    btn.setAttribute('data-page', pageNum);

    if (pageNum === currentPage) {
      btn.classList.add('active');
    }

    // CLICK HANDLER
    btn.addEventListener('click', () => {
      if (pageNum === activePage) return; // already active
      activePage = pageNum;
      getCategories(activeFilter, pageNum, PAGE_LIMIT);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    container.appendChild(btn);
  }
}

// First load
getCategories(activeFilter, activePage, PAGE_LIMIT);
