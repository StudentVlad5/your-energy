import { loadMore, onSearch } from './js/render-functions';
import { ref } from './js/CONSTATNT';

// функція пошуку
ref.searchButton.addEventListener('click', onSearch);
ref.loadMoreButton.addEventListener('click', loadMore);
