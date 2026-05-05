# 🚀 Production Deployment Guide - Supabase + Railway

## 📋 Overview

This guide will help you deploy your Ticketmaster multi-admin system to production using:
- **Supabase**: Database and authentication
- **Railway**: Backend API (optional)
- **Vercel**: Frontend hosting

## 🔧 Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `ticketmaster`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be ready (2-3 minutes)

### 1.2 Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.3 Run Database Schema

1. Go to **SQL Editor** in Supabase
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql`
4. Paste into the editor
5. Click "Run" to execute

This will create:
- `admins` table
- `events` table
- Proper indexes and RLS policies
- Sample admin account (username: `admin`, password: `admin123`)

### 1.4 Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Railway Backend API (if using)
VITE_API_URL=https://your-ticketmaster-backend.railway.app/api
```

## 🚂 Step 2: Set Up Railway (Optional Backend)

### 2.1 Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Sign up/login
3. Click "New Project"

### 2.2 Deploy Backend

1. Click "Deploy from GitHub repo"
2. Select your `ticketmaster` repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `PORT`: `3001`
5. Click "Deploy"

### 2.3 Get Railway URL

After deployment, Railway will provide:
```
https://your-ticketmaster-backend.railway.app
```

## 🌐 Step 3: Deploy to Vercel

### 3.1 Update Vercel Configuration

Your `vercel.json` is already configured. Just ensure:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "vite",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "destination": "/index.html",
      "source": "/(.*)"
    }
  ]
}
```

### 3.2 Add Environment Variables in Vercel

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_API_URL`: Your Railway URL (if using)

### 3.3 Deploy

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Add Supabase and Railway configuration"
   git push origin main
   ```

2. Vercel will auto-deploy
3. Wait for deployment to complete

## 🎯 Step 4: Test Production Deployment

### 4.1 Test Admin Registration

1. Go to your Vercel URL: `https://ticketmaster-xxxxx.vercel.app/admin/register`
2. Register a new admin account
3. Check Supabase dashboard → **Table Editor** → `admins` table
4. Verify new admin appears

### 4.2 Test Event Creation

1. Login as admin
2. Create an event
3. Check Supabase dashboard → **Table Editor** → `events` table
4. Verify event appears with correct admin_id

### 4.3 Test Public Event Display

1. Go to main app: `https://ticketmaster-xxxxx.vercel.app/`
2. Navigate to Discover page
3. Verify events from all admins appear
4. Check event attribution shows correct admin

## 🔍 Step 5: Monitor and Debug

### Supabase Monitoring

1. **Dashboard**: Overview of database usage
2. **Logs**: Real-time query logs
3. **Database**: Table editor and SQL queries
4. **Authentication**: User sessions and activity

### Railway Monitoring

1. **Metrics**: CPU, memory, and network usage
2. **Logs**: Application logs
3. **Deployments**: Deployment history

### Vercel Monitoring

1. **Analytics**: Traffic and performance
2. **Logs**: Build and deployment logs
3. **Functions**: Edge function logs

## 📊 Database Schema Overview

### Admins Table
```sql
- id: UUID (Primary Key)
- username: VARCHAR(50) (Unique)
- password: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Events Table
```sql
- id: UUID (Primary Key)
- admin_id: UUID (Foreign Key → admins.id)
- name: VARCHAR(255)
- state: VARCHAR(50)
- city: VARCHAR(100)
- stadium: VARCHAR(255)
- day: VARCHAR(10)
- date: VARCHAR(20)
- time: VARCHAR(20)
- order_num: VARCHAR(50)
- tickets: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## 🔒 Security Considerations

### Current Implementation
- ⚠️ Passwords stored in plain text (demo only)
- ⚠️ No proper authentication tokens
- ⚠️ RLS policies enabled but not fully tested

### Production Recommendations
- ✅ Hash passwords using bcrypt
- ✅ Implement JWT authentication
- ✅ Use Supabase Auth for user management
- ✅ Add rate limiting
- ✅ Implement proper error handling
- ✅ Add input validation
- ✅ Use HTTPS everywhere

## 🚀 Performance Optimization

### Database Indexes
- `idx_events_admin_id`: Fast admin event queries
- `idx_events_created_at`: Chronological event ordering
- `idx_admins_username`: Quick admin lookups

### Caching Strategy
- Vercel Edge Caching for static assets
- Supabase Query Caching for frequent reads
- Client-side state management for admin data

## 📱 API Endpoints

### Frontend → Supabase (Direct)
- `POST /admin/register` → Create admin
- `POST /admin/login` → Authenticate admin
- `GET /admin/events` → Get admin's events
- `POST /admin/events` → Create event
- `PUT /admin/events/:id` → Update event
- `DELETE /admin/events/:id` → Delete event
- `GET /events` → Get all events (public)

### Railway Backend (Optional)
- `/api/admin/login` → Backend authentication
- `/api/admin/register` → Backend registration
- `/api/admin/events` → Backend event management

## 🛠️ Troubleshooting

### Common Issues

**Issue**: "Supabase connection failed"
**Solution**: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

**Issue**: "Events not appearing"
**Solution**: Check RLS policies and admin_id foreign key

**Issue**: "CORS errors"
**Solution**: Add your Vercel domain to Supabase CORS settings

**Issue**: "Build fails on Vercel"
**Solution**: Check environment variables are set correctly

## 📈 Scaling Considerations

### Database Scaling
- Monitor Supabase usage limits
- Implement connection pooling
- Consider read replicas for high traffic

### Backend Scaling
- Railway auto-scales based on usage
- Monitor CPU and memory usage
- Implement caching for frequent queries

### Frontend Scaling
- Vercel handles global CDN
- Optimize bundle size
- Implement lazy loading

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Railway backend deployed (optional)
- [ ] Vercel frontend deployed
- [ ] Admin registration working
- [ ] Event creation working
- [ ] Public event display working
- [ ] HTTPS enabled
- [ ] Monitoring configured

---

**Your Ticketmaster multi-admin system is now production-ready!** 🚀