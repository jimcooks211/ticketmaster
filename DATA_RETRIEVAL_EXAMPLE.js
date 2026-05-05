// Event.jsx Data Retrieval Process - Detailed Example

// ============================================
// STEP 1: localStorage Data Structure
// ============================================
/*
localStorage.getItem('adminUsers') returns this JSON string:

[
  {
    "id": "1714859200000",
    "username": "admin1",
    "password": "password123",
    "createdAt": "2026-05-04T10:00:00.000Z",
    "events": [
      {
        "id": "1714859300000",
        "name": "Taylor Swift Concert",
        "state": "NY",
        "city": "New York",
        "stadium": "Madison Square Garden",
        "day": "FRI",
        "date": "DEC 15, 2026",
        "time": "8:00 PM",
        "orderNum": "123456789",
        "tickets": [
          { "section": "101", "row": "A", "seat": "1" },
          { "section": "101", "row": "A", "seat": "2" }
        ],
        "createdAt": "2026-05-04T10:01:00.000Z",
        "createdBy": "admin1"
      }
    ]
  },
  {
    "id": "1714859400000",
    "username": "admin2",
    "password": "password456",
    "createdAt": "2026-05-04T10:02:00.000Z",
    "events": [
      {
        "id": "1714859500000",
        "name": "Ed Sheeran Concert",
        "state": "CA",
        "city": "Los Angeles",
        "stadium": "Staples Center",
        "day": "SAT",
        "date": "JAN 20, 2027",
        "time": "7:30 PM",
        "orderNum": "987654321",
        "tickets": [
          { "section": "201", "row": "B", "seat": "5" },
          { "section": "201", "row": "B", "seat": "6" }
        ],
        "createdAt": "2026-05-04T10:03:00.000Z",
        "createdBy": "admin2"
      }
    ]
  }
]
*/

// ============================================
// STEP 2: JSON.parse() Conversion
// ============================================
/*
const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

Result: JavaScript Array of Objects
[
  {
    id: "1714859200000",
    username: "admin1",
    password: "password123",
    createdAt: "2026-05-04T10:00:00.000Z",
    events: [
      {
        id: "1714859300000",
        name: "Taylor Swift Concert",
        state: "NY",
        city: "New York",
        stadium: "Madison Square Garden",
        day: "FRI",
        date: "DEC 15, 2026",
        time: "8:00 PM",
        orderNum: "123456789",
        tickets: [
          { section: "101", row: "A", seat: "1" },
          { section: "101", row: "A", seat: "2" }
        ],
        createdAt: "2026-05-04T10:01:00.000Z",
        createdBy: "admin1"
      }
    ]
  },
  {
    id: "1714859400000",
    username: "admin2",
    password: "password456",
    createdAt: "2026-05-04T10:02:00.000Z",
    events: [
      {
        id: "1714859500000",
        name: "Ed Sheeran Concert",
        state: "CA",
        city: "Los Angeles",
        stadium: "Staples Center",
        day: "SAT",
        date: "JAN 20, 2027",
        time: "7:30 PM",
        orderNum: "987654321",
        tickets: [
          { section: "201", row: "B", seat: "5" },
          { section: "201", row: "B", seat: "6" }
        ],
        createdAt: "2026-05-04T10:03:00.000Z",
        createdBy: "admin2"
      }
    ]
  }
]
*/

// ============================================
// STEP 3: .reduce() Aggregation Process
// ============================================
/*
const allEvents = adminUsers.reduce((acc, admin) => {
  if (admin.events && admin.events.length > 0) {
    const eventsWithImages = admin.events.map(event => ({
      ...event,
      IMG: event.IMG || concertIMG1,
      createdBy: admin.username
    }));
    return [...acc, ...eventsWithImages];
  }
  return acc;
}, []);

Iteration 1 (admin1):
  acc = []
  admin.events = [Taylor Swift Concert]
  eventsWithImages = [
    {
      id: "1714859300000",
      name: "Taylor Swift Concert",
      state: "NY",
      city: "New York",
      stadium: "Madison Square Garden",
      day: "FRI",
      date: "DEC 15, 2026",
      time: "8:00 PM",
      orderNum: "123456789",
      tickets: [
        { section: "101", row: "A", seat: "1" },
        { section: "101", row: "A", seat: "2" }
      ],
      createdAt: "2026-05-04T10:01:00.000Z",
      createdBy: "admin1",
      IMG: concertIMG1  // Added default image
    }
  ]
  return [...[], ...eventsWithImages] = [Taylor Swift Concert]

Iteration 2 (admin2):
  acc = [Taylor Swift Concert]
  admin.events = [Ed Sheeran Concert]
  eventsWithImages = [
    {
      id: "1714859500000",
      name: "Ed Sheeran Concert",
      state: "CA",
      city: "Los Angeles",
      stadium: "Staples Center",
      day: "SAT",
      date: "JAN 20, 2027",
      time: "7:30 PM",
      orderNum: "987654321",
      tickets: [
        { section: "201", row: "B", seat: "5" },
        { section: "201", row: "B", seat: "6" }
      ],
      createdAt: "2026-05-04T10:03:00.000Z",
      createdBy: "admin2",
      IMG: concertIMG1  // Added default image
    }
  ]
  return [[Taylor Swift Concert], ...[Ed Sheeran Concert]]
  = [Taylor Swift Concert, Ed Sheeran Concert]

Final Result:
allEvents = [
  {
    id: "1714859300000",
    name: "Taylor Swift Concert",
    state: "NY",
    city: "New York",
    stadium: "Madison Square Garden",
    day: "FRI",
    date: "DEC 15, 2026",
    time: "8:00 PM",
    orderNum: "123456789",
    tickets: [
      { section: "101", row: "A", seat: "1" },
      { section: "101", row: "A", seat: "2" }
    ],
    createdAt: "2026-05-04T10:01:00.000Z",
    createdBy: "admin1",
    IMG: concertIMG1
  },
  {
    id: "1714859500000",
    name: "Ed Sheeran Concert",
    state: "CA",
    city: "Los Angeles",
    stadium: "Staples Center",
    day: "SAT",
    date: "JAN 20, 2027",
    time: "7:30 PM",
    orderNum: "987654321",
    tickets: [
      { section: "201", row: "B", seat: "5" },
      { section: "201", row: "B", seat: "6" }
    ],
    createdAt: "2026-05-04T10:03:00.000Z",
    createdBy: "admin2",
    IMG: concertIMG1
  }
]
*/

// ============================================
// STEP 4: State Update
// ============================================
/*
if (allEvents.length > 0) {
  setEvents(allEvents);           // Updates Events state
  setTotalTickets(allEvents.length);  // Updates ticket count
}

Result:
Events state = [
  {
    id: "1714859300000",
    name: "Taylor Swift Concert",
    state: "NY",
    city: "New York",
    stadium: "Madison Square Garden",
    day: "FRI",
    date: "DEC 15, 2026",
    time: "8:00 PM",
    orderNum: "123456789",
    tickets: [
      { section: "101", row: "A", seat: "1" },
      { section: "101", row: "A", seat: "2" }
    ],
    createdAt: "2026-05-04T10:01:00.000Z",
    createdBy: "admin1",
    IMG: concertIMG1
  },
  {
    id: "1714859500000",
    name: "Ed Sheeran Concert",
    state: "CA",
    city: "Los Angeles",
    stadium: "Staples Center",
    day: "SAT",
    date: "JAN 20, 2027",
    time: "7:30 PM",
    orderNum: "987654321",
    tickets: [
      { section: "201", row: "B", seat: "5" },
      { section: "201", row: "B", seat: "6" }
    ],
    createdAt: "2026-05-04T10:03:00.000Z",
    createdBy: "admin2",
    IMG: concertIMG1
  }
]

totalTickets state = 2
*/

// ============================================
// STEP 5: Component Rendering
// ============================================
/*
The Events state is now used in the JSX:

{Events.map((event, key) => (
  <div key={key} onClick={() => handleEventClick(event)}>
    <img src={event.IMG} alt={`${key} IMG`} />
    <div className="card-items">
      <div className="timedetails">
        <p>{event.day}</p> •
        <p>{event.date}</p> •
        <p>{event.time}</p>
      </div>
      <div className="eventdetails">
        <p>{event.name}</p>
        <hr />
        <p>{event.stadium} - {event.state}, {event.city}</p>
      </div>
    </div>
  </div>
))}

This renders two event cards:
1. Taylor Swift Concert (created by admin1)
2. Ed Sheeran Concert (created by admin2)
*/

// ============================================
// KEY POINTS
// ============================================
/*
1. Data Source: localStorage key 'adminUsers'
2. Data Format: JSON string → JavaScript array
3. Aggregation: .reduce() combines all admin events
4. Enhancement: Adds IMG and createdBy fields
5. State Update: setEvents() triggers re-render
6. Display: Events.map() renders event cards
7. Fallback: Uses defaultEvents if no admin data
8. Real-time: useEffect runs on component mount
*/