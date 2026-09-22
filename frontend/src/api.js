// api.js - Remove credentials: 'include', it's causing CORS to fail
// You use localStorage/headers for session, NOT cookies, so this is not needed

export const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const sessionId = localStorage.getItem('session_id');
  const headers = {
    ...(sessionId ? { 'x-session-id': sessionId } : {}),
    ...options.headers
  };

  // ❌ REMOVED: options.credentials = 'include'
  // This was forcing strict CORS rules even though you don't use cookies

  if (options.body && !(options.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
      ...headers
    };
  } else {
    options.headers = headers;
  }

  const response = await fetch(url, options);

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  }

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.detail || 'API request failed');
  }

  return data;
}

export async function apiPost(endpoint, data = {}, options = {}) {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
}

export async function apiGet(endpoint, options = {}) {
  return apiFetch(endpoint, {
    method: 'GET',
    ...options
  });
}

export function checkAuth() {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    window.location.href = '/index.html';
    return null;
  }
  return sessionId;
}

export async function logout() {
  try {
    await apiFetch('/api/logout', { method: 'POST' });
  } catch (err) {
    console.warn('Backend logout call returned error:', err);
  } finally {
    localStorage.removeItem('session_id');
    localStorage.removeItem('docmind_session');
    localStorage.removeItem('kiln_session');
    window.location.href = '/index.html';
  }
}