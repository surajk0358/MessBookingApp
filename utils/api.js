//utils/api.js
const baseURL = 'http://localhost:4000/api'; // Change for production

class API {
  static async get(endpoint, params = {}) {
    const url = new URL(`${baseURL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  static async post(endpoint, data) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async patch(endpoint, data) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  // User methods
  static async getUser(mobile) {
    return this.get(`/auth/user/${mobile.replace('+', '')}`);
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

  // Menu methods
  static async getMenus(messId, date) {
    return this.get('/menus', { messId, date });
  }

  // Order methods
  static async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  static async createOrder(data) {
    return this.post('/orders', data);
  }

  static async updateOrderStatus(id, status) {
    return this.patch(`/orders/${id}`, { status });
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