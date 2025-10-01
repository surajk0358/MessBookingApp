
import { getToken } from './storage';

const baseURL = 'http://localhost:5000/api'; // Matches server.js PORT

class API {
  static async request(endpoint, method = 'GET', data = null, params = {}) {
    const url = new URL(`${baseURL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
    };

    try {
      const response = await fetch(url, config);
      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error(`API ${method} error at ${endpoint}:`, error.message);
      throw new Error(responseData.error || error.message || 'An unexpected error occurred');
    }
  }

  static async get(endpoint, params = {}) {
    return this.request(endpoint, 'GET', null, params);
  }

  static async post(endpoint, data) {
    return this.request(endpoint, 'POST', data);
  }

  static async patch(endpoint, data) {
    return this.request(endpoint, 'PATCH', data);
  }

  static async delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }

  // Auth methods
  static async register(data) {
    return this.post('/auth/register', data);
  }

  static async login(identifier, password) {
    return this.post('/auth/login', { identifier, password });
  }

  // User methods
  static async getUser(mobile) {
    return this.get(`/auth/user/${encodeURIComponent(mobile.replace('+', ''))}`);
  }

  static async updateUser(id, updates) {
    return this.patch(`/auth/user/${id}`, updates);
  }

  // Mess methods
  static async getMesses(params = {}) {
    return this.get('/messes', params);
  }

  static async getMess(id) {
    return this.get(`/messes/${id}`);
  }

  static async createMess(data) {
    return this.post('/messes', data);
  }

  // Menu methods
  static async getMenus(messId, params = {}) {
    return this.get(`/messMenus/${messId}`, params);
  }

  static async createMenu(messId, data) {
    return this.post(`/messMenus/${messId}`, data);
  }

  static async updateMenu(id, data) {
    return this.patch(`/messMenus/${id}`, data);
  }

  static async deleteMenu(id) {
    return this.delete(`/messMenus/${id}`);
  }

  // Order methods
  static async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  static async createOrder(data) {
    return this.post('/orders', data);
  }

  // Subscription methods
  static async getUserSubscriptions(userId) {
    return this.get(`/users/${userId}/subscriptions`);
  }

  static async createSubscription(userId, data) {
    return this.post(`/users/${userId}/subscriptions`, data);
  }

  // Stats
  static async getOwnerStats(ownerId) {
    return this.get(`/stats/owner/${ownerId}`);
  }
}

export { API };
