// Local Storage Keys
export const STORAGE_KEYS = {};

export const COLORS = {
  WHITE: '#fff',
  BLACK: '#000',
  GRAY_LIGHT: '#808080',
};

// API Endpoints
export const API_ENDPOINTS = {
  FILTERS: '/filters',
  EXERCISES: '/exercises',
  QUOTE: '/quote',
  SUBSCRIPTION: '/subscription',
};

// ========== REGULAR EXPRESSIONS ==========
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
};

// ========== VALIDATION CONSTANTS ==========
export const VALIDATION = {
  EMAIL_REGEX: REGEX.EMAIL,
  RATING_MIN: 1,
  RATING_MAX: 5,
};

// ========== PAGINATION CONSTANTS ==========
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
};

// ========== TOAST NOTIFICATION CONSTANTS ==========
export const TOAST = {
  POSITION: {
    TOP_RIGHT: 'topRight',
    TOP_LEFT: 'topLeft',
    TOP_CENTER: 'topCenter',
    BOTTOM_RIGHT: 'bottomRight',
    BOTTOM_LEFT: 'bottomLeft',
    BOTTOM_CENTER: 'bottomCenter',
  },

  TIMEOUT: {
    SHORT: 2000,
    DEFAULT: 4000,
    LONG: 6000,
  },

  TRANSITION: {
    IN: 'fadeInLeft',
    OUT: 'fadeOutRight',
  },

  TITLE: {
    SUCCESS: 'OK',
    ERROR: 'Error',
    INFO: 'Info',
    WARNING: 'Warning',
  },

  ICON: {
    SUCCESS: 'icon-check',
    ERROR: 'icon-error',
    INFO: 'icon-info',
    WARNING: 'icon-warning',
  },
};

// ========== SEO CONSTANTS ==========
export const SEO = {
  SCHEMA_CONTEXT: 'https://schema.org',
  SCHEMA_TYPES: {
    ITEM_LIST: 'ItemList',
    LIST_ITEM: 'ListItem',
    EXERCISE_PLAN: 'ExercisePlan',
  },
  JSON_LD_TYPE: 'application/ld+json',
};

// ========== MODAL TYPES ==========
export const MODAL_TYPES = {
  RATING: 'rating',
  EXERCISE: 'exercise',
};

// ========== ERROR MESSAGES ==========
export const ERROR_MESSAGES = {
  API_ERROR: 'Something went wrong',
  EMAIL_REQUIRED: 'Please enter a valid email.',
  RATING_RANGE: `Rating must be between ${VALIDATION.RATING_MIN} and ${VALIDATION.RATING_MAX}`,
  EXERCISE_ID_REQUIRED: 'Exercise ID is required',
};

export const REFS = {
  modalBody: document.querySelector('[data-modal-body]'),

  favoritesBtn: document.querySelector('.favorites-btn'),
  favoritesList: document.querySelector('.favorites-list'),

  exercisesList: document.querySelector('.js-exercises-list'),
  exercisesActiveTab: document.querySelector('.exercises__tab--active'),
  exercisesPagination: document.querySelector('.js-exercises-pagination'),

  modalTemplate: document.getElementById('modal-template'),
  modalCloseBtn: document.querySelector('.modal-template__close-btn'),
  modalBackdrop: document.querySelector('.modal-template__backdrop'),

  exerciseModal: document.querySelector('.exercise-modal'), // from modal-exercise.html
  exerciseTrigger: document.querySelector('[data-modal="exercise"]'),


  // Filters
  filtersTabs: document.querySelector('[data-filters-tabs]'),
  filtersSearchBox: document.querySelector('.filters__search'),
  filtersSubtitle: document.querySelector('.filters__subtitle'),
  filtersInput: document.querySelector('.filters__input'),
  filtersClearBtn: document.querySelector('.filters__clear-btn'),

  // Mobile menu
  mobileMenu: document.querySelector('[data-menu]'),
  mobileMenuOpenBtn: document.querySelector('[data-menu-open]'),
  mobileMenuCloseBtn: document.querySelector('[data-menu-close]'),
};
