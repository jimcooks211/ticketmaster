const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

console.log(`=== STARTUP DEBUG ===`);
console.log(`process.env.PORT = ${process.env.PORT}`);
console.log(`Using PORT = ${PORT}`);
console.log(`JWT_SECRET set: ${!!JWT_SECRET}`);
console.log(`SUPABASE_URL set: ${!!process.env.SUPABASE_URL}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY set: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}`);
console.log(`====================`);

if (!JWT_SECRET) { console.error('FATAL: JWT_SECRET not set.'); process.exit(1); }
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.'); process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors({
  origin: ['https://ticketmaster-twlj.vercel.app', 'https://ticketmaster-tau-tawny.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  try { req.admin = jwt.verify(header.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid or expired token' }); }
};

const ensureBucket = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === 'event-images');
  if (!exists) {
    await supabase.storage.createBucket('event-images', { public: true });
    console.log('Created event-images bucket');
  }
};
ensureBucket().catch(console.error);

app.post('/api/admin/upload-image', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided' });
  const mimeToExt = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/heic': 'heic' };
  const ext = mimeToExt[req.file.mimetype] || 'jpg';
  const adminId = req.admin.id.replace(/-/g, '');
  const fileName = `${adminId}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('event-images')
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
  if (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Image upload failed: ' + error.message });
  }
  const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fileName);
  res.json({ url: publicUrl });
});

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
  image_url: ev.image_url || null,
  createdAt: ev.created_at,
  admin_id: ev.admin_id,
  createdBy: ev.admins?.username || null
});

app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const { data: existing } = await supabase.from('admins').select('id').eq('username', username).maybeSingle();
  if (existing) return res.status(409).json({ error: 'Username already exists' });
  const hash = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase.from('admins').insert([{ username, password: hash }]).select().single();
  if (error) { console.error('Register error:', error); return res.status(500).json({ error: 'Server error during registration' }); }
  res.json({ success: true, id: data.id });
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  const { data: admin } = await supabase.from('admins').select('*').eq('username', username).maybeSingle();
  if (!admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, id: admin.id, username: admin.username });
});

app.get('/api/admin/events', auth, async (req, res) => {
  const { data, error } = await supabase.from('events').select('*').eq('admin_id', req.admin.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(formatEvent));
});

app.post('/api/admin/events', auth, async (req, res) => {
  const { name, state, city, stadium, time, date, day, orderNum, tickets = [], image_url } = req.body || {};
  const { data, error } = await supabase.from('events')
    .insert([{ admin_id: req.admin.id, name, state, city, stadium, time, date, day, order_num: orderNum, tickets, image_url: image_url || null }])
    .select().single();
  if (error) { console.error('Create event error:', error); return res.status(500).json({ error: 'Failed to create event' }); }
  res.status(201).json(formatEvent(data));
});

app.put('/api/admin/events/:id', auth, async (req, res) => {
  const { name, state, city, stadium, time, date, day, orderNum, tickets = [], image_url } = req.body || {};
  const { data: existing } = await supabase.from('events').select('id').eq('id', req.params.id).eq('admin_id', req.admin.id).maybeSingle();
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  const updateData = { name, state, city, stadium, time, date, day, order_num: orderNum, tickets };
  if (image_url !== undefined) updateData.image_url = image_url;
  const { data, error } = await supabase.from('events').update(updateData).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(formatEvent(data));
});

app.delete('/api/admin/events/:id', auth, async (req, res) => {
  const { data: existing } = await supabase.from('events').select('id').eq('id', req.params.id).eq('admin_id', req.admin.id).maybeSingle();
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  const { error } = await supabase.from('events').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/events', async (req, res) => {
  const { data, error } = await supabase.from('events').select('*, admins(username)').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(formatEvent));
});

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ticketmaster backend running on port ${PORT}`);
  console.log(`ENV PORT value: ${process.env.PORT}`);
});
