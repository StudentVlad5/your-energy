import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper';
import { ERROR_MESSAGES } from './constants.js';

export const fetchApi = new YourEnergyAPI();

const quote = {
  content: document.querySelector('.js-quote-content'),
  author: document.querySelector('.js-quote-author'),
};

function getQuoteData() {
  const storedQuote = localStorage.getItem('quoteData');
  if (storedQuote) {
    const { quote: quoteContent, author, date } = JSON.parse(storedQuote);
    const savedDate = new Date(date);
    const currentDate = new Date();

    if (savedDate.getDate() === currentDate.getDate()) {
      addTextContent(quoteContent, author);
      return;
    }
  }
  fetchGetExercisesQuote();
}

getQuoteData();

async function fetchGetExercisesQuote() {
  try {
    const resp = await fetchApi.getQuote();

    const { quote: newQuote, author } = resp;
    const quoteData = { quote: newQuote, author, date: new Date() };
    localStorage.setItem('quoteData', JSON.stringify(quoteData));
    addTextContent(newQuote, author);
  } catch (err) {
    showError(err.message || ERROR_MESSAGES.API_ERROR);
  }
}

function addTextContent(content, author) {
  if (quote.content) {
    quote.content.textContent = content;
  }
  if (quote.author) {
    quote.author.textContent = author;
  }
}
