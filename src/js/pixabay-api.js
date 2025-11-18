import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { ref } from './CONSTATNT';
import axios from 'axios';

export const fetchImages = async url => {
  try {
    const { data, status } = await axios.get(url);
    if (status !== 200) {
      throw new Error(`HTTP error! Status: ${status}`);
    }

    // --- Перевірки результатів пошуку ---
    if (data.totalHits === 0) {
      iziToast.warning({
        title: 'Oops!',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
      });
      ref.loadMoreButton.style.display = 'none';
      return '';
    }

    // --- Якщо знайшли результати ---
    iziToast.success({
      title: 'Success!',
      message: `Hooray! We found ${data.totalHits} images.`,
    });

    // редагуємо цифри для візуалізації

    const generationView = item => {
      const num = Number(item);
      if (isNaN(num)) return item;

      if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
      } else {
        return num.toString();
      }
    };

    // --- Генеруємо HTML ---
    const markup = data.hits
      .map(
        img => `
        <li class="gallery__item">
          <div class="img--wrap">
            <a class="gallery__link" href="${
              img.largeImageURL
            }" target="_parent" rel="noopener noreferrer">
              <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
            </a>
          </div>
          <div class="gallery__item--info">
            <ul class="gallery__item--style"><li>Likes</li><li>${generationView(
              img.likes
            )}</li></ul>
            <ul class="gallery__item--style"><li>Views</li><li>${generationView(
              img.views
            )}</li></ul>
            <ul class="gallery__item--style"><li>Comments</li><li>${generationView(
              img.comments
            )}</li></ul>
            <ul class="gallery__item--style"><li>Downloads</li><li>${generationView(
              img.downloads
            )}</li></ul>
          </div>
        </li>`
      )
      .join('');

    // --- Приховати кнопку якщо остання сторінка ---
    const totalPages = Math.ceil(data.totalHits / ref.per_page);
    if (ref.page >= totalPages) {
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
      });
      ref.loadMoreButton.style.display = 'none';
    } else {
      ref.loadMoreButton.style.display = 'flex';
    }

    return markup;
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching images.',
    });
    ref.loadMoreButton.style.display = 'none';
    return '';
  }
};
