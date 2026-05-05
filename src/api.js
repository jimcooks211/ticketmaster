const BASE = '/api';

const getToken = () => localStorage.getItem('adminToken');

export const isLoggedIn = () => !!getToken();

export const getAdminInfo = () => ({
  id: localStorage.getItem('adminId'),
  username: localStorage.getItem('adminUsername')
});

const request = async (path, options = {}) => {
  const token = getToken();

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (networkErr) {
    throw new Error('Cannot reach the server. Make sure the backend is running on port 3001.');
  }

  // Parse body safely — server might return empty body on some errors
  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned unexpected response (${res.status}). Is the backend running?`);
  }

  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (username, password) => {
  const data = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  localStorage.setItem('adminToken', data.token);
  localStorage.setItem('adminId', data.id);
  localStorage.setItem('adminUsername', data.username);
  return data;
};

export const register = (username, password) =>
  request('/admin/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminId');
  localStorage.removeItem('adminUsername');
};

// ── Admin Events ──────────────────────────────────────────────────────────────

export const fetchAdminEvents = () => request('/admin/events');

export const createEvent = (eventData) =>
  request('/admin/events', { method: 'POST', body: JSON.stringify(eventData) });

export const updateEvent = (id, eventData) =>
  request(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) });

export const deleteEvent = (id) =>
  request(`/admin/events/${id}`, { method: 'DELETE' });

// ── Public Events (for Event.jsx) ─────────────────────────────────────────────

export const fetchAllEvents = () => request('/events');
