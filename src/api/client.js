// Central API client. Every network call to the .NET backend goes through here.
// Dev: base is '' and Vite proxies /api to the backend. Prod: VITE_API_BASE_URL.

const BASE = import.meta.env.VITE_API_URL || 
             (window.location.hostname !== 'localhost' 
               ? 'https://emotionalistic-audient-darrick.ngrok-free.dev/mpamoja' 
               : '');

const TOKEN_KEY = 'mpamoja.jwt';

export const tokenStore = {
    getToken: () => localStorage.getItem(TOKEN_KEY), // 👈 Changed from get to getToken
    set: (t) => localStorage.setItem(TOKEN_KEY, t),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

/** Error carrying the server's friendly message + HTTP status. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = tokenStore.get();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Network error. Check your connection and try again.', 0);
  }

  if (res.status === 401) {
    tokenStore.clear();
    throw new ApiError('Your session has expired. Please sign in again.', 401);
  }

  // 204 No Content
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // Backend returns { error: "friendly message" } on 400s.
    throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status);
  }
  return data;
}

// ── Auth (Sprint 2, FR-AUTH) ──
export const authApi = {
  register: (fullName, phone, email, password) =>
    request('/api/auth/register', { method: 'POST', auth: false, body: { fullName, phone, email, password } }),
  verify: (phone, code) =>
    request('/api/auth/verify', { method: 'POST', auth: false, body: { phone, code } }),
  resendOtp: (phone) =>
    request('/api/auth/resend-otp', { method: 'POST', auth: false, body: { phone } }),
  login: (emailOrPhone, password) =>
    request('/api/auth/login', { method: 'POST', auth: false, body: { emailOrPhone, password } }),
  forgotPassword: (phone) =>
    request('/api/auth/forgot-password', { method: 'POST', auth: false, body: { phone } }),
  resetPassword: (phone, code, newPassword) =>
    request('/api/auth/reset-password', { method: 'POST', auth: false, body: { phone, code, newPassword } }),
};

// ── Kitties (Sprint 2, FR-KTY) ──
export const kittyApi = {
  create: (payload) => request('/api/kitties', { method: 'POST', body: payload }),
  mine: () => request('/api/kitties'),
  get: (id) => request(`/api/kitties/${id}`),
  update: (id, payload) => request(`/api/kitties/${id}`, { method: 'PUT', body: payload }),
  close: (id) => request(`/api/kitties/${id}/close`, { method: 'POST' }),
  remove: (id) => request(`/api/kitties/${id}`, { method: 'DELETE' }),
  linkWhatsAppGroup: (id, groupName, inviteLink) =>
    request(`/api/kitties/${id}/whatsapp-groups`, { method: 'POST', body: { groupName, inviteLink } }),
};

// ── Public contribution flow (Sprint 1-2, FR-CON, no auth) ──
export const publicApi = {
  getKitty: (shareToken) =>
    request(`/api/public/kitties/${shareToken}`, { auth: false }),
  contribute: (shareToken, { name, phone, amountKes, anonymous }) =>
    request(`/api/public/kitties/${shareToken}/contribute`, {
      method: 'POST', auth: false, body: { name, phone, amountKes, anonymous },
    }),
  contributionStatus: (shareToken, intentId) =>
    request(`/api/public/kitties/${shareToken}/contribute/${intentId}`, { auth: false }),
};

// ── Withdrawals (Sprint 3, FR-WDR) ──
export const withdrawalApi = {
  requestOtp: () => request('/api/withdrawals/request-otp', { method: 'POST' }),
  initiate: ({ kittyId, amountKes, target, otpCode }) =>
    request('/api/withdrawals', { method: 'POST', body: { kittyId, amountKes, target, otpCode } }),
  approve: (id, approve, note) =>
    request(`/api/withdrawals/${id}/approve`, { method: 'POST', body: { approve, note } }),
  forKitty: (kittyId) => request(`/api/withdrawals/kitty/${kittyId}`),
};

// ── Dev-only simulators (Sprint 3 DevController; Development environment only) ──
export const devApi = {
  simulatePaymentSuccess: (intentId) =>
    request(`/api/dev/payments/${intentId}/simulate-success`, { method: 'POST' }),
  simulateB2C: (withdrawalId, success = true) =>
    request(`/api/dev/withdrawals/${withdrawalId}/simulate-b2c?success=${success}`, { method: 'POST' }),
  verifyKyc: (userId) =>
    request(`/api/dev/users/${userId}/verify-kyc`, { method: 'POST' }),
};
