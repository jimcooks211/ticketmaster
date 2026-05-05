// All admin and event operations go through the Railway backend.
// The backend holds the Supabase service role key securely.

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ── LocalStorage helpers ──────────────────────────────────────────────────────

export const getAdminInfo = () => ({
  id: localStorage.getItem('adminId'),
  username: localStorage.getItem('adminUsername'),
  token: localStorage.getItem('adminToken')
});

export const isLoggedIn = () => !!localStorage.getItem('adminToken');

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

const request = async (path, options = {}) => {
  const { token } = getAdminInfo();

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
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

export const register = async (username, password) => {
  return await request('/admin/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminId');
  localStorage.removeItem('adminUsername');
};

// ── Admin Events ──────────────────────────────────────────────────────────────

export const fetchAdminEvents = async () => {
  return await request('/admin/events');
};

export const createEvent = async (eventData) => {
  return await request('/admin/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};

export const updateEvent = async (id, eventData) => {
  return await request(`/admin/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  });
};

export const deleteEvent = async (id) => {
  return await request(`/admin/events/${id}`, { method: 'DELETE' });
};

// ── Image Upload ──────────────────────────────────────────────────────────────

export const uploadImage = async (file) => {
  const { token } = getAdminInfo();
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/admin/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Image upload failed');
  return data.url;
};

// ── Public Events ─────────────────────────────────────────────────────────────

export const fetchAllEvents = async () => {
  const data = await request('/events');
  return data.map(event => ({
    ...event,
    IMG: event.image_url || null
  }));
};
