const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Datastore = require('@seald-io/nedb');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tm-secret-change-in-prod';

// ── Databases (files auto-created in /backend/data/) ─────────────────────────
const dataDir = path.join(__dirname, 'data');

const admins = new Datastore({
  filename: path.join(dataDir, 'admins.db'),
  autoload: true
});
const events = new Datastore({
  filename: path.join(dataDir, 'events.db'),
  autoload: true
});

admins.ensureIndex({ fieldName: 'username', unique: true });

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

  const hash = bcrypt.hashSync(password, 10);
  try {
    const doc = await admins.insertAsync({ username, password: hash, createdAt: new Date() });
    res.json({ success: true, id: doc._id });
  } catch (err) {
    if (err.errorType === 'uniqueViolated')
      return res.status(409).json({ error: 'Username already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  const admin = await admins.findOneAsync({ username });
  if (!admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, id: admin._id, username: admin.username });
});

// ── Event helpers ─────────────────────────────────────────────────────────────
const formatEvent = (ev, adminUsername = null) => ({
  id: ev._id,
  name: ev.name,
  state: ev.state,
  city: ev.city,
  stadium: ev.stadium,
  time: ev.time,
  date: ev.date,
  day: ev.day,
  orderNum: ev.orderNum,
  tickets: ev.tickets || [],
  createdAt: ev.createdAt,
  createdBy: adminUsername || ev.adminUsername || null
});

// ── Admin Event Routes ────────────────────────────────────────────────────────

// GET /api/admin/events
app.get('/api/admin/events', auth, async (req, res) => {
  const docs = await events.findAsync({ adminId: req.admin.id }).sort({ createdAt: -1 });
  res.json(docs.map(e => formatEvent(e)));
});

// POST /api/admin/events
app.post('/api/admin/events', auth, async (req, res) => {
  const { name, state, city, stadium, time, date, day, orderNum, tickets = [] } = req.body || {};
  try {
    const doc = await events.insertAsync({
      adminId: req.admin.id,
      adminUsername: req.admin.username,
      name, state, city, stadium, time, date, day, orderNum, tickets,
      createdAt: new Date()
    });
    res.status(201).json(formatEvent(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/admin/events/:id
app.put('/api/admin/events/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, state, city, stadium, time, date, day, orderNum, tickets = [] } = req.body || {};

  const existing = await events.findOneAsync({ _id: id, adminId: req.admin.id });
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  await events.updateAsync(
    { _id: id },
    { $set: { name, state, city, stadium, time, date, day, orderNum, tickets } }
  );
  const updated = await events.findOneAsync({ _id: id });
  res.json(formatEvent(updated));
});

// DELETE /api/admin/events/:id
app.delete('/api/admin/events/:id', auth, async (req, res) => {
  const existing = await events.findOneAsync({ _id: req.params.id, adminId: req.admin.id });
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  await events.removeAsync({ _id: req.params.id });
  res.json({ success: true });
});

// ── Public Route ──────────────────────────────────────────────────────────────

// GET /api/events — all events for Event.jsx
app.get('/api/events', async (req, res) => {
  const docs = await events.findAsync({}).sort({ createdAt: -1 });
  res.json(docs.map(e => formatEvent(e, e.adminUsername)));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Ticketmaster backend running at http://localhost:${PORT}`);
});
