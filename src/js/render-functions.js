import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { ref } from './CONSTATNT';
import { fetchImages } from './pixabay-api';

let lightbox = null;
let currentQuery = '';

// --- Пошук ---
export async function onSearch(e) {
  e.preventDefault();

  const query = ref.searchInput.value.trim();
  if (!query) return;

  if (query !== currentQuery) {
    currentQuery = query;
    ref.page = 1;
    ref.galleryList.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ref.infoLoadingMessage.innerHTML = 'Loading images, please wait...';
  ref.loadMoreButton.style.display = 'none';

  const url = `${ref.URL}?key=${ref.key}&q=${encodeURIComponent(
    query
  )}&image_type=${ref.image_type}&orientation=${ref.orientation}&per_page=${
    ref.per_page
  }&page=${ref.page}`;

  const markup = await fetchImages(url);
  ref.infoLoadingMessage.innerHTML = '';
  ref.galleryList.insertAdjacentHTML('beforeend', markup);

  // Ініціалізація або оновлення lightbox
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery__link', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

// --- Load more ---
export async function loadMore(e) {
  e.preventDefault();
  ref.infoLoadingMessage.innerHTML = 'Loading images, please wait...';
  ref.searchButton.disabled = true;
  ref.searchButton.style.backgroundColor = '#808080';

  ref.page += 1;
  const url = `${ref.URL}?key=${ref.key}&q=${encodeURIComponent(
    currentQuery
  )}&image_type=${ref.image_type}&orientation=${ref.orientation}&per_page=${
    ref.per_page
  }&page=${ref.page}`;

  const markup = await fetchImages(url);

  // зберігаємо позицію перед оновленням
  const prevScrollHeight = ref.galleryList.scrollHeight;
  ref.infoLoadingMessage.innerHTML = '';
  ref.galleryList.insertAdjacentHTML('beforeend', markup);
  lightbox?.refresh();

  // після вставки — плавно прокручуємо до нових фото
  window.scrollTo({
    top: prevScrollHeight - 100,
    behavior: 'smooth',
  });

  ref.searchButton.disabled = false;
  ref.searchButton.style.backgroundColor = '#4e75ff';
}
