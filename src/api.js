import { supabase, db } from './supabase';

// Production API Configuration
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get current admin info from localStorage
const getAdminInfo = () => ({
  id: localStorage.getItem('adminId'),
  username: localStorage.getItem('adminUsername'),
  token: localStorage.getItem('adminToken')
});

// Check if user is logged in
export const isLoggedIn = () => !!localStorage.getItem('adminToken');

// ── Auth Functions (Supabase with localStorage fallback) ─────────────────────────────

export const login = async (username, password) => {
  try {
    // Try Supabase first
    const admin = await db.admins.getByUsername(username);

    // Verify password (in production, use proper password hashing)
    if (admin.password !== password) {
      throw new Error('Invalid username or password');
    }

    // Store admin info in localStorage
    localStorage.setItem('adminToken', 'dummy-token-' + Date.now());
    localStorage.setItem('adminId', admin.id);
    localStorage.setItem('adminUsername', admin.username);

    return {
      id: admin.id,
      username: admin.username,
      token: localStorage.getItem('adminToken')
    };
  } catch (error) {
    // Fallback to localStorage for testing if Supabase fails
    console.warn('Supabase login failed, trying localStorage fallback:', error.message);

    try {
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const localAdmin = localUsers.find(u => u.username === username && u.password === password);

      if (localAdmin) {
        localStorage.setItem('adminToken', 'local-token-' + Date.now());
        localStorage.setItem('adminId', localAdmin.id);
        localStorage.setItem('adminUsername', localAdmin.username);

        return {
          id: localAdmin.id,
          username: localAdmin.username,
          token: localStorage.getItem('adminToken')
        };
      }

      throw new Error('Invalid username or password');
    } catch (localError) {
      throw new Error('Invalid username or password');
    }
  }
};

export const register = async (username, password) => {
  try {
    // Try Supabase first
    // Check if username already exists
    try {
      await db.admins.getByUsername(username);
      throw new Error('Username already exists');
    } catch (error) {
      // If error is "not found", that's good - username is available
      if (error.message.includes('not found') || error.code === 'PGRST116') {
        // Continue with registration
      } else {
        throw error;
      }
    }

    // Create new admin in Supabase
    const newAdmin = await db.admins.create({
      username,
      password // In production, hash this!
    });

    return {
      id: newAdmin.id,
      username: newAdmin.username,
      message: 'Registration successful'
    };
  } catch (error) {
    // Fallback to localStorage for testing if Supabase fails
    console.warn('Supabase registration failed, trying localStorage fallback:', error.message);

    try {
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

      // Check if username already exists
      if (localUsers.find(u => u.username === username)) {
        throw new Error('Username already exists');
      }

      // Create new admin
      const newAdmin = {
        id: Date.now().toString(),
        username,
        password,
        createdAt: new Date().toISOString(),
        events: []
      };

      localUsers.push(newAdmin);
      localStorage.setItem('adminUsers', JSON.stringify(localUsers));

      return {
        id: newAdmin.id,
        username: newAdmin.username,
        message: 'Registration successful'
      };
    } catch (localError) {
      throw new Error(localError.message || 'Registration failed');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminId');
  localStorage.removeItem('adminUsername');
};

// ── Admin Events Functions (Supabase with localStorage fallback) ─────────────────────

export const fetchAdminEvents = async () => {
  const adminInfo = getAdminInfo();
  if (!adminInfo.id) {
    throw new Error('Not logged in');
  }

  try {
    // Try Supabase first
    const events = await db.events.getByAdminId(adminInfo.id);
    return events;
  } catch (error) {
    // Fallback to localStorage for testing
    console.warn('Supabase fetch failed, trying localStorage fallback:', error.message);

    try {
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const localAdmin = localUsers.find(u => u.id === adminInfo.id);

      if (localAdmin) {
        return localAdmin.events || [];
      }

      return [];
    } catch (localError) {
      console.error('Local storage fetch failed:', localError);
      return [];
    }
  }
};

export const createEvent = async (eventData) => {
  const adminInfo = getAdminInfo();
  if (!adminInfo.id) {
    throw new Error('Not logged in');
  }

  try {
    // Try Supabase first
    const event = await db.events.create({
      admin_id: adminInfo.id,
      ...eventData
    });
    return event;
  } catch (error) {
    // Fallback to localStorage for testing
    console.warn('Supabase create failed, trying localStorage fallback:', error.message);

    try {
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const adminIndex = localUsers.findIndex(u => u.id === adminInfo.id);

      if (adminIndex !== -1) {
        const newEvent = {
          id: Date.now().toString(),
          ...eventData,
          createdAt: new Date().toISOString(),
          createdBy: adminInfo.username
        };

        if (!localUsers[adminIndex].events) {
          localUsers[adminIndex].events = [];
        }

        localUsers[adminIndex].events.push(newEvent);
        localStorage.setItem('adminUsers', JSON.stringify(localUsers));

        return newEvent;
      }

      throw new Error('Admin not found');
    } catch (localError) {
      throw new Error(localError.message || 'Failed to create event');
    }
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    // Try Supabase first
    const event = await db.events.update(id, eventData);
    return event;
  } catch (error) {
    // Fallback to localStorage for testing
    console.warn('Supabase update failed, trying localStorage fallback:', error.message);

    try {
      const adminInfo = getAdminInfo();
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const adminIndex = localUsers.findIndex(u => u.id === adminInfo.id);

      if (adminIndex !== -1) {
        const eventIndex = localUsers[adminIndex].events.findIndex(e => e.id === id);

        if (eventIndex !== -1) {
          localUsers[adminIndex].events[eventIndex] = {
            ...localUsers[adminIndex].events[eventIndex],
            ...eventData
          };
          localStorage.setItem('adminUsers', JSON.stringify(localUsers));
          return localUsers[adminIndex].events[eventIndex];
        }
      }

      throw new Error('Event not found');
    } catch (localError) {
      throw new Error(localError.message || 'Failed to update event');
    }
  }
};

export const deleteEvent = async (id) => {
  try {
    // Try Supabase first
    await db.events.delete(id);
    return { success: true };
  } catch (error) {
    // Fallback to localStorage for testing
    console.warn('Supabase delete failed, trying localStorage fallback:', error.message);

    try {
      const adminInfo = getAdminInfo();
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const adminIndex = localUsers.findIndex(u => u.id === adminInfo.id);

      if (adminIndex !== -1) {
        localUsers[adminIndex].events = localUsers[adminIndex].events.filter(e => e.id !== id);
        localStorage.setItem('adminUsers', JSON.stringify(localUsers));
        return { success: true };
      }

      throw new Error('Admin not found');
    } catch (localError) {
      throw new Error(localError.message || 'Failed to delete event');
    }
  }
};

// ── Public Events Functions (Supabase with localStorage fallback) ─────────────────────

export const fetchAllEvents = async () => {
  try {
    // Try Supabase first
    const events = await db.events.getAll();

    // Transform events to match expected format
    return events.map(event => ({
      ...event,
      orderNum: event.order_num,
      IMG: event.IMG || '/matt_rife.webp',
      createdBy: event.admins?.username || 'Unknown'
    }));
  } catch (error) {
    // Fallback to localStorage for testing
    console.warn('Supabase fetch all failed, trying localStorage fallback:', error.message);

    try {
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

      const allEvents = localUsers.reduce((acc, admin) => {
        if (admin.events && admin.events.length > 0) {
          const eventsWithImages = admin.events.map(event => ({
            ...event,
            orderNum: event.orderNum || event.order_num,
            IMG: event.IMG || '/matt_rife.webp',
            createdBy: admin.username
          }));
          return [...acc, ...eventsWithImages];
        }
        return acc;
      }, []);

      return allEvents;
    } catch (localError) {
      console.error('Local storage fetch all failed:', localError);
      return [];
    }
  }
};

// ── Helper Functions ─────────────────────────────────────────────────────────────

export const getCurrentAdmin = async () => {
  const adminInfo = getAdminInfo();
  if (!adminInfo.id) {
    return null;
  }

  try {
    // Try Supabase first
    const admin = await db.admins.getById(adminInfo.id);
    return admin;
  } catch (error) {
    // Fallback to localStorage
    console.warn('Supabase get admin failed, trying localStorage fallback:', error.message);

    try {
      const localUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      return localUsers.find(u => u.id === adminInfo.id) || null;
    } catch (localError) {
      return null;
    }
  }
};