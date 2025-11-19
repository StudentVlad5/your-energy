import axios from 'axios';

export class YourEnergyAPI {
  constructor(baseURL = 'https://your-energy.b.goit.study/api') {
    this.baseURL = baseURL;
    this.axios = axios.create({
      baseURL: this.baseURL,
    });

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      response => response,
      error => {
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
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
    return this._request('get', '/filters', null, params);
  }

  /**
   * Get exercises
   * @param {Object} params - Query parameters (bodypart, muscles, equipment, keyword, page, limit)
   * @returns {Promise<Object>}
   */
  async getExercises(params = {}) {
    return this._request('get', '/exercises', null, params);
  }

  /**
   * Get quote of the day
   * @returns {Promise<Object>}
   */
  async getQuote() {
    return this._request('get', '/quote');
  }

  /**
   * Subscribe to new exercises
   * @param {Object} data - { email: string }
   * @returns {Promise<Object>}
   */
  async subscribe(data) {
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Valid email is required');
    }
    return this._request('post', '/subscription', data);
  }

  /**
   * Add rating to exercise
   * @param {string} id - Exercise ID
   * @param {Object} data - { rate: number, email: string, review: string }
   * @returns {Promise<Object>}
   */
  async rateExercise(id, data) {
    if (!id) {
      throw new Error('Exercise ID is required');
    }
    if (!data.rate || data.rate < 1 || data.rate > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Valid email is required');
    }
    return this._request('patch', `/exercises/${id}/rating`, data);
  }
}
