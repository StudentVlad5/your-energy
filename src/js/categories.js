import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper';
import { injectSchema } from './seo-function';
import { handleCategoryCardClick } from './categories-card-click';
export const fetchApi = new YourEnergyAPI();

const PAGE_LIMIT = window.innerWidth < 768 ? 9 : 12;

// UI state
let activeFilter = 'Muscles';
let activePage = 1;

async function getCategories(filter = activeFilter, page = 1, limit = PAGE_LIMIT) {
  activeFilter = filter;
  activePage = page;

  try {
    const params = { filter, page, limit };
    const data = await fetchApi.getFilters(params);

    if (!data) {
      showError("Failed to fetch categories: No response from server");
      clearCards();
      clearPagination();
      return;
    }

    if (data.error || data.status === 'error') {
      showError(data.message || "Failed to fetch categories");
      clearCards();
      clearPagination();
      return;
    }

    if (!data.results || data.results.length === 0) {
      showError("Nothing found");
      clearCards();
      clearPagination();
      return;
    }

    renderCards(data.results || []);
    renderPagination(activePage, data.totalPages || 1);

    if (typeof injectSchema === 'function') {
      injectSchema(data);
    }
  } catch (err) {
    console.error('getCategories error:', err);
    showError(err?.message || 'Something went wrong');
    clearCards();
    clearPagination();
  }
}

// Cards
function renderCards(items) {
  const container = document.getElementById('cards-container');
  if (!container) return;
  container.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    // Safe values
    const safeImg = item.imgURL && item.imgURL.trim() !== "" 
      ? item.imgURL 
      : "/img/no-image.jpg";     // fallback image
    
    const safeName = item.name || "";
    const safeFilter = item.filter || "";

    card.innerHTML = `
      <img src="${safeImg}" alt="${safeName}" loading="lazy" />
      <div class="card-body">
        <h3>${safeName}</h3>
        <span>${safeFilter}</span>
      </div>
    `;
    handleCategoryCardClick;
    card.addEventListener('click', handleCategoryCardClick(item));
    container.appendChild(card);

    const cardBody = card.querySelector(".card-body");
    cardBody.addEventListener("click", () => {
      onCardBodyClick(safeName);
    });
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

    btn.addEventListener('click', () => {
      if (pageNum === activePage) return;
      activePage = pageNum;
      getCategories(activeFilter, pageNum, PAGE_LIMIT);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    container.appendChild(btn);
  }
}

// Clear Helpers
function clearCards() {
  const container = document.getElementById("cards-container");
  if (container) container.innerHTML = "";
}

function clearPagination() {
  const container = document.getElementById("pagination");
  if (container) container.innerHTML = "";
}

// Callback on card click
export function onCardBodyClick(nameValue) {
  console.log("Clicked name:", nameValue);
  // here need to add logic how to join categories and exercises
}

// First load
getCategories(activeFilter, activePage, PAGE_LIMIT);
