import axios from 'axios';
import { CONFIG } from './config.js';
import { VALIDATION, ERROR_MESSAGES, API_ENDPOINTS } from './constants.js';

export class YourEnergyAPI {
  constructor(baseURL = CONFIG.BASE_API_URL) {
    this.baseURL = baseURL;
    this.axios = axios.create({
      baseURL: this.baseURL,
    });

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      response => response,
      error => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          ERROR_MESSAGES.API_ERROR;
        console.error('API Error:', errorMessage);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic request handler
   * @private
   * @param {string} method - HTTP method
   * @param {string} url - Endpoint URL
   * @param {Object|null} data - Request body
   * @param {Object|null} params - Query parameters
   * @returns {Promise<Object>}
   */
  async _request(method, url, data = null, params = null) {
    try {
      const config = { method, url };
      if (data) config.data = data;
      if (params) config.params = params;

      const response = await this.axios(config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`${method.toUpperCase()} ${url} failed: ${message}`);
    }
  }

  /**
   * Get filters
   * @param {Object} params - Query parameters (filter, page, limit)
   * @returns {Promise<Object>}
   */
  async getFilters(params = {}) {
    return this._request('get', API_ENDPOINTS.FILTERS, null, params);
  }

  /**
   * Get exercises
   * @param {Object} params - Query parameters (bodypart, muscles, equipment, keyword, page, limit)
   * @returns {Promise<Object>}
   */
  async getExercises(params = {}) {
    return this._request('get', API_ENDPOINTS.EXERCISES, null, params);
  }

  async getExerciseById(id) {
    if (!id) {
      throw new Error(ERROR_MESSAGES.EXERCISE_ID_REQUIRED);
    }
    return this._request('get', `${API_ENDPOINTS.EXERCISES}/${id}`);
  }

  /**
   * Get quote of the day
   * @returns {Promise<Object>}
   */
  async getQuote() {
    return this._request('get', API_ENDPOINTS.QUOTE);
  }

  /**
   * Subscribe to new exercises
   * @param {Object} data - { email: string }
   * @returns {Promise<Object>}
   */
  async subscribe(data) {
    if (!data.email || !VALIDATION.EMAIL_REGEX.test(data.email)) {
      throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
    }
    return this._request('post', API_ENDPOINTS.SUBSCRIPTION, data);
  }

  /**
   * Add rating to exercise
   * @param {string} id - Exercise ID
   * @param {Object} data - { rate: number, email: string, review: string }
   * @returns {Promise<Object>}
   */
  async rateExercise(id, data) {
    if (!id) {
      throw new Error(ERROR_MESSAGES.EXERCISE_ID_REQUIRED);
    }
    if (
      !data.rate ||
      data.rate < VALIDATION.RATING_MIN ||
      data.rate > VALIDATION.RATING_MAX
    ) {
      throw new Error(ERROR_MESSAGES.RATING_RANGE);
    }
    if (!data.email || !VALIDATION.EMAIL_REGEX.test(data.email)) {
      throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
    }
    return this._request(
      'patch',
      `${API_ENDPOINTS.EXERCISES}/${id}/rating`,
      data
    );
  }
}
