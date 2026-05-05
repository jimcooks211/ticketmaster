const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ── Format helper ─────────────────────────────────────────────────────────────
const formatEvent = (ev) => ({
  id: ev.id,
  name: ev.name,
  state: ev.state,
  city: ev.city,
  stadium: ev.stadium,
  time: ev.time,
  date: ev.date,
  day: ev.day,
  orderNum: ev.order_num,
  tickets: ev.tickets || [],
  createdAt: ev.created_at,
  admin_id: ev.admin_id,
  createdBy: ev.admins?.username || null
});

// ── Auth Routes ───────────────────────────────────────────────────────────────

// POST /api/admin/register
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });
  if (username.length < 3)
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  // Check if username already taken
  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (existing) return res.status(409).json({ error: 'Username already exists' });

  const hash = bcrypt.hashSync(password, 10);

  const { data, error } = await supabase
    .from('admins')
    .insert([{ username, password: hash }])
    .select()
    .single();

  if (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }

  res.json({ success: true, id: data.id });
});

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error || !admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, id: admin.id, username: admin.username });
});

// ── Admin Event Routes ────────────────────────────────────────────────────────

// GET /api/admin/events
app.get('/api/admin/events', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('admin_id', req.admin.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(formatEvent));
});

// POST /api/admin/events
app.post('/api/admin/events', auth, async (req, res) => {
  const { name, state, city, stadium, time, date, day, orderNum, tickets = [] } = req.body || {};

  const { data, error } = await supabase
    .from('events')
    .insert([{
      admin_id: req.admin.id,
      name, state, city, stadium, time, date, day,
      order_num: orderNum,
      tickets
    }])
    .select()
    .single();

  if (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ error: 'Failed to create event' });
  }

  res.status(201).json(formatEvent(data));
});

// PUT /api/admin/events/:id
app.put('/api/admin/events/:id', auth, async (req, res) => {
  const { name, state, city, stadium, time, date, day, orderNum, tickets = [] } = req.body || {};

  // Confirm event belongs to this admin
  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('id', req.params.id)
    .eq('admin_id', req.admin.id)
    .maybeSingle();

  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const { data, error } = await supabase
    .from('events')
    .update({ name, state, city, stadium, time, date, day, order_num: orderNum, tickets })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(formatEvent(data));
});

// DELETE /api/admin/events/:id
app.delete('/api/admin/events/:id', auth, async (req, res) => {
  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('id', req.params.id)
    .eq('admin_id', req.admin.id)
    .maybeSingle();

  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Public Route ──────────────────────────────────────────────────────────────

// GET /api/events — all events for public-facing pages
app.get('/api/events', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*, admins(username)')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(formatEvent));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Ticketmaster backend running on port ${PORT}`);
});
