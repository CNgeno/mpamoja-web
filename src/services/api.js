const API_BASE = '/api';

// Helper to get auth token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('mpamoja_user') || '{}');
  return user.token || '';
};

// API request wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard summary
  getSummary: () => apiRequest('/dashboard/summary'),
  
  // Get all kitties
  getKitties: () => apiRequest('/dashboard/kitties'),
  
  // Get activity feed
  getActivity: () => apiRequest('/dashboard/activity'),
  
  // Create a new kitty
  createKitty: (data) => apiRequest('/kitties', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // Get a single kitty
  getKitty: (id) => apiRequest(`/kitties/${id}`),
  
  // Update a kitty
  updateKitty: (id, data) => apiRequest(`/kitties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // Delete a kitty
  deleteKitty: (id) => apiRequest(`/kitties/${id}`, {
    method: 'DELETE'
  })
};

// Kitty API
export const kittyApi = {
  // Get all kitties for the user
  getAll: () => apiRequest('/kitties'),
  
  // Get a single kitty
  get: (id) => apiRequest(`/kitties/${id}`),
  
  // Create a new kitty
  create: (data) => apiRequest('/kitties', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // Update a kitty
  update: (id, data) => apiRequest(`/kitties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // Delete a kitty
  delete: (id) => apiRequest(`/kitties/${id}`, {
    method: 'DELETE'
  }),
  
  // Add a contribution
  contribute: (id, data) => apiRequest(`/kitties/${id}/contribute`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // Withdraw from kitty
  withdraw: (id, data) => apiRequest(`/kitties/${id}/withdraw`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Chama API
export const chamaApi = {
  getAll: () => apiRequest('/chamas'),
  get: (id) => apiRequest(`/chamas/${id}`),
  create: (data) => apiRequest('/chamas', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/chamas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/chamas/${id}`, {
    method: 'DELETE'
  }),
  contribute: (id, data) => apiRequest(`/chamas/${id}/contribute`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Events API
export const eventApi = {
  getAll: () => apiRequest('/events'),
  get: (id) => apiRequest(`/events/${id}`),
  create: (data) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE'
  })
};

// Auth API
export const authApi = {
  login: (data) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  register: (data) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  verify: (data) => apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  resendOtp: (data) => apiRequest('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};