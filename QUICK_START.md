# Quick Start Guide - Multi-Admin System

## 🚀 Getting Started

### Step 1: Register Your First Admin
1. Open browser: `http://localhost:5173/admin/register`
2. Fill in the form:
   - **Username**: `admin1` (or any unique name)
   - **Password**: `password123` (min 6 characters)
   - **Confirm Password**: `password123`
3. Click "Create Account"
4. You'll be redirected to login after 2 seconds

### Step 2: Login as First Admin
1. At `http://localhost:5173/admin`
2. Enter credentials:
   - **Username**: `admin1`
   - **Password**: `password123`
3. Click "Login"
4. You'll see your personal dashboard

### Step 3: Create Events as Admin1
1. Click "Create Event" button
2. Fill in event details:
   - **Event Name**: "Taylor Swift Concert"
   - **State**: "NY"
   - **City**: "New York"
   - **Stadium**: "Madison Square Garden"
   - **Day**: "FRI"
   - **Date**: "DEC 15, 2026"
   - **Time**: "8:00 PM"
   - **Order Number**: "123456789"
3. Add tickets:
   - **Ticket 1**: Section "101", Row "A", Seat "1"
   - **Ticket 2**: Section "101", Row "A", Seat "2"
4. Click "Create Event"

### Step 4: Register Second Admin
1. Open new tab: `http://localhost:5173/admin/register`
2. Fill in the form:
   - **Username**: `admin2` (different from admin1)
   - **Password**: `password456`
   - **Confirm Password**: `password456`
3. Click "Create Account"

### Step 5: Login as Second Admin
1. At `http://localhost:5173/admin`
2. Enter credentials:
   - **Username**: `admin2`
   - **Password**: `password456`
3. Click "Login"
4. You'll see admin2's dashboard (empty - no events yet)

### Step 6: Create Events as Admin2
1. Click "Create Event" button
2. Fill in event details:
   - **Event Name**: "Ed Sheeran Concert"
   - **State**: "CA"
   - **City**: "Los Angeles"
   - **Stadium**: "Staples Center"
   - **Day**: "SAT"
   - **Date**: "JAN 20, 2027"
   - **Time**: "7:30 PM"
   - **Order Number**: "987654321"
3. Add tickets:
   - **Ticket 1**: Section "201", Row "B", Seat "5"
   - **Ticket 2**: Section "201", Row "B", Seat "6"
4. Click "Create Event"

### Step 7: View All Events in Main App
1. Navigate to: `http://localhost:5173/`
2. Go to "Discover" page (bottom nav)
3. You'll see events from BOTH admins:
   - "Taylor Swift Concert" (Created by: admin1)
   - "Ed Sheeran Concert" (Created by: admin2)
4. Go to "Tickets" page
5. You'll see both events with full ticket details

## 🔑 Key Features Demonstrated

### ✅ Multi-Admin System
- Each admin has their own account
- Username uniqueness enforced
- Per-admin event isolation

### ✅ Per-Admin Dashboard
- Admin1 sees only their events
- Admin2 sees only their events
- Welcome message shows current admin

### ✅ Global Event Display
- Main app shows events from all admins
- Event attribution shows creator
- All ticket details preserved

### ✅ Data Persistence
- All data saved in localStorage
- Survives browser refresh
- Multiple admin accounts supported

## 🎯 Testing Scenarios

### Test 1: Username Uniqueness
1. Try to register with username "admin1" again
2. Should see error: "Username already exists"

### Test 2: Password Validation
1. Try to register with password "123" (too short)
2. Should see error: "Password must be at least 6 characters"

### Test 3: Event Isolation
1. Login as admin1
2. Create an event
3. Logout
4. Login as admin2
5. Should NOT see admin1's event in dashboard

### Test 4: Global Event Display
1. Create events as admin1
2. Create events as admin2
3. Go to main app Discover page
4. Should see events from BOTH admins

### Test 5: Event Attribution
1. Create event as admin1
2. Create event as admin2
3. Check main app
4. Each event shows "Created by: [username]"

## 🛠️ Troubleshooting

### "Username already exists"
- Choose a different username
- Usernames are case-sensitive

### "Password must be at least 6 characters"
- Use a longer password
- Minimum 6 characters required

### Can't see events in main app
- Refresh the page
- Check browser console for errors
- Verify events were created successfully

### Dashboard shows wrong events
- Logout and login again
- Check you're logged in as correct admin
- Each admin sees only their own events

## 📱 Access URLs

- **Register**: `http://localhost:5173/admin/register`
- **Login**: `http://localhost:5173/admin`
- **Dashboard**: `http://localhost:5173/admin/dashboard`
- **Main App**: `http://localhost:5173/`

## 💡 Tips

1. **Use descriptive usernames** to easily identify admins
2. **Create test events** with different details to verify isolation
3. **Check localStorage** in DevTools to see data structure:
   - Key: `adminUsers` - Contains all admin accounts
   - Each user has their own `events` array
4. **Refresh pages** to see updates take effect
5. **Use different browsers** to test multiple simultaneous sessions

## 🎉 Success Indicators

✅ Multiple admin accounts can be created
✅ Each admin has isolated dashboard
✅ Events show creator attribution
✅ Main app displays all admins' events
✅ Username uniqueness is enforced
✅ Password validation works correctly
✅ Data persists across sessions

---

**Ready to test!** Follow the steps above to verify the multi-admin system works correctly.