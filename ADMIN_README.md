# Multi-Admin System Documentation

## Overview
A complete multi-admin system where each admin can create their own account and manage their own events and tickets. Each admin has their own isolated database.

## Features

### 🔐 Multi-Admin Authentication
- **Account Registration**: Create admin accounts with username and password
- **Username Uniqueness**: Prevents duplicate usernames
- **Secure Login**: Individual admin authentication
- **Session Management**: Per-admin session tracking
- **Protected Routes**: Dashboard accessible only to logged-in admins

### 📊 Per-Admin Dashboard
- Each admin sees only their own events
- Personalized welcome message with username
- Event count display for individual admin
- Quick access to create, edit, and delete own events

### 🎫 Event Management
- **Create Events**: Full form with all event fields
- **Edit Events**: Modify existing event details
- **Delete Events**: Remove events with confirmation
- **View Events**: See event details at a glance
- **Event Attribution**: Events show which admin created them

### 📝 Event Fields
All fields from Event.jsx are included:

#### Event Information
- Event Name (required)
- State (required)
- City (required)
- Stadium/Venue (required)
- Day (MON-SUN dropdown)
- Date (e.g., JUN 28, 2026)
- Time (e.g., 7:00 PM)

#### Order Information
- Order Number (required)

#### Tickets
- Multiple tickets per event
- Each ticket includes:
  - Section (required)
  - Row (required)
  - Seat (required)
- Add/remove tickets dynamically

### 🔄 Global Event Display
- Events from all admins appear in main app
- Discover page shows all admin-created events
- Tickets page displays events from all admins
- Each event shows creator attribution

## Routes

### Main App Routes
- `/` - Main application (Home, For You, Tickets, Sell, Account)
- `/*` - Fallback to main app

### Admin Routes
- `/admin` - Admin login page
- `/admin/register` - Admin registration page
- `/admin/dashboard` - Protected admin dashboard (per-admin)

## Usage

### 1. Register an Admin Account
Navigate to: `http://localhost:5173/admin/register`

Fill in the registration form:
- **Username**: Choose a unique username (min 3 characters)
- **Password**: Create a password (min 6 characters)
- **Confirm Password**: Re-enter password

Click "Create Account" to register.

### 2. Login to Admin Panel
Navigate to: `http://localhost:5173/admin`

Enter your credentials:
- **Username**: Your registered username
- **Password**: Your password

Click "Login" to access your dashboard.

### 3. Create an Event
1. Click "Create Event" button in your dashboard
2. Fill in all required fields:
   - Event Information (name, location, venue, date/time)
   - Order Information (order number)
   - Tickets (add multiple tickets with section, row, seat)
3. Click "Create Event"

### 4. Manage Your Events
- **Edit**: Click pencil icon on your event card
- **Delete**: Click trash icon (with confirmation)
- **View**: See your event details in the card

### 5. View Events in Main App
Your events automatically appear in:
- **Discover page**: Events displayed in a grid with creator attribution
- **Tickets page**: Events shown in ticket cards
- Events from all admins are aggregated and displayed

## Technical Details

### Data Storage
- **Admin Users**: Stored in `localStorage` under key: `adminUsers`
  - Each user object contains:
    - `id`: Unique user ID
    - `username`: Admin username
    - `password`: Admin password
    - `createdAt`: Account creation timestamp
    - `events`: Array of events created by this admin

- **Session Data**: Stored in `localStorage`
  - `currentAdminId`: Currently logged-in admin's ID
  - `currentAdminUsername`: Currently logged-in admin's username
  - `isAdminLoggedIn`: Session status flag

- **Data Persistence**: All data persists across browser sessions

### Per-Admin Isolation
- Each admin has their own events array
- Events are stored within the admin user object
- Dashboard only shows events for logged-in admin
- Main app aggregates events from all admins

### Components
- `AdminRegister.jsx` - Registration form with validation
- `AdminLogin.jsx` - Login form with authentication
- `AdminDashboard.jsx` - Per-admin dashboard with event management
- `Admin.css` - Complete styling for admin interface

### Integration
- Events created by any admin sync to main app
- Event.jsx loads events from all admins
- Discover.jsx displays events from all admins
- Each event shows which admin created it

### Security Notes
⚠️ **Demo Implementation**
- Current implementation uses localStorage for data storage
- Passwords are stored in plain text (not hashed)
- No backend API or database
- In production, implement:
  - Proper authentication (JWT, OAuth)
  - Password hashing (bcrypt, argon2)
  - Backend API with database
  - Role-based access control
  - HTTPS encryption

## File Structure

```
src/
├── admin/
│   ├── AdminRegister.jsx   # Registration component
│   ├── AdminLogin.jsx      # Login component
│   ├── AdminDashboard.jsx  # Per-admin dashboard
│   └── Admin.css           # Admin styles
├── components/
│   ├── Event.jsx           # Updated to load events from all admins
│   └── Discover.jsx        # Updated to display events from all admins
└── App.jsx                 # Updated with routing
```

## Development

### Start Development Server
```bash
npm run dev
```

### Access Admin Panel
- **Register**: `http://localhost:5173/admin/register`
- **Login**: `http://localhost:5173/admin`
- **Dashboard**: `http://localhost:5173/admin/dashboard` (after login)

### Build for Production
```bash
npm run build
```

## Multi-Admin Workflow

### Creating Multiple Admins
1. First admin registers at `/admin/register`
2. First admin logs in and creates events
3. Second admin registers at `/admin/register`
4. Second admin logs in and creates their own events
5. Both admins' events appear in main app

### Event Attribution
- Each event shows "Created by: [username]"
- Helps identify which admin created which event
- Visible in both dashboard and main app

### Data Isolation
- Admin A can only see/edit/delete their own events
- Admin B can only see/edit/delete their own events
- Main app shows events from all admins
- No cross-admin event modification

## Validation Rules

### Registration
- Username: Required, min 3 characters, must be unique
- Password: Required, min 6 characters
- Confirm Password: Must match password

### Login
- Username: Required
- Password: Required
- Must match registered credentials

### Event Creation
- All event fields are required
- At least one ticket must be added
- All ticket fields (section, row, seat) are required

## Troubleshooting

### Can't register with username
- Check if username already exists
- Username must be at least 3 characters
- Try a different username

### Can't login
- Verify username and password are correct
- Check if account was created successfully
- Clear localStorage and try registering again

### Events not appearing in main app
- Check browser console for errors
- Verify `adminUsers` exists in localStorage
- Ensure events are created in your dashboard
- Refresh the main app page

### Can't see other admins' events in dashboard
- This is expected behavior - each admin sees only their own events
- Events from all admins appear in main app (Discover/Tickets pages)
- Check main app to see all events

### Session issues
- Ensure you're logged in
- Check `currentAdminId` in localStorage
- Try logging out and logging back in

## Future Enhancements

### Authentication
- [ ] Implement JWT authentication
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Password hashing (bcrypt)
- [ ] Password reset functionality
- [ ] Two-factor authentication

### Admin Management
- [ ] Admin profile editing
- [ ] Admin account deletion
- [ ] Admin role management (super admin, regular admin)
- [ ] Admin activity logs
- [ ] Admin permissions system

### Event Management
- [ ] Image upload for event images
- [ ] Event categories and tags
- [ ] Event search and filtering
- [ ] Bulk event operations
- [ ] Event templates

### Data Management
- [ ] Backend API integration
- [ ] Database storage (PostgreSQL, MongoDB)
- [ ] Data export/import
- [ ] Analytics and reporting
- [ ] Real-time event updates

### UI/UX
- [ ] Dark mode support
- [ ] Responsive design improvements
- [ ] Loading states and animations
- [ ] Error handling and validation
- [ ] Admin activity dashboard

## Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage data structure
3. Ensure all dependencies are installed
4. Check network tab for API calls (when implemented)
5. Review validation rules and requirements

---

**Note**: This is a demo implementation using localStorage. For production use, implement proper authentication, backend API, secure password storage, and a real database system.