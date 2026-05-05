import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lzhehowjxhsjtguedayo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xoN7nii3StZ-3iQUKa_0LA_sPyIUUYJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Tables
export const TABLES = {
  ADMINS: 'admins',
  EVENTS: 'events'
};

// Helper functions for database operations
export const db = {
  // Admin operations
  admins: {
    async getByUsername(username) {
      const { data, error } = await supabase
        .from(TABLES.ADMINS)
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from(TABLES.ADMINS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async create(adminData) {
      const { data, error } = await supabase
        .from(TABLES.ADMINS)
        .insert([{
          username: adminData.username,
          password: adminData.password, // In production, hash this!
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from(TABLES.ADMINS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Event operations
  events: {
    async getAll() {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select(`
          *,
          admins!inner(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getByAdminId(adminId) {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('admin_id', adminId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async create(eventData) {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .insert([{
          admin_id: eventData.admin_id,
          name: eventData.name,
          state: eventData.state,
          city: eventData.city,
          stadium: eventData.stadium,
          day: eventData.day,
          date: eventData.date,
          time: eventData.time,
          order_num: eventData.orderNum,
          tickets: eventData.tickets,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id, eventData) {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({
          name: eventData.name,
          state: eventData.state,
          city: eventData.city,
          stadium: eventData.stadium,
          day: eventData.day,
          date: eventData.date,
          time: eventData.time,
          order_num: eventData.orderNum,
          tickets: eventData.tickets,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }
  }
};

export default supabase;