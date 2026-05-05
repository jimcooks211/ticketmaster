import img1 from '../imgs/home_image1.jpg'
import img2 from '../imgs/home_image2.PNG'
import img3 from '../imgs/home_image3.PNG'
import img4 from '../imgs/home_image4.PNG'
import img5 from '../imgs/home_image5.PNG'
import img6 from '../imgs/home_image6.PNG'
import img7 from '../imgs/home_image7.PNG'
import img8 from '../imgs/home_image8.PNG'
import img9 from '../imgs/home_image9.PNG'
import img10 from '../imgs/home_image10.PNG'
import concertIMG1 from '../imgs/matt_rife.webp'
import { useState, useEffect } from 'react'
import '../App.css'

const Homepage = () => {
  const [events, setEvents] = useState([])

  // Load events from all admins on mount
  useEffect(() => {
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

    // Aggregate events from all admins
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

    setEvents(allEvents);
  }, []);

  return (
    <div className="homepage">
      <img src={img1} alt="Home1"/>
      <img src={img2} alt="" />
      <img src={img3} alt="" />
      <img src={img4} alt="" />
      <img src={img5} alt="" />
      <img src={img6} alt="" />
      <img src={img7} alt="" />
      <img src={img8} alt="" />
      <img src={img9} alt="" />
      <img src={img10} alt="" />

      {/* Display admin-created events */}
      {events.length > 0 && (
        <div className="admin-events-section">
          <h2 className="admin-events-title">Available Events</h2>
          <div className="admin-events-grid">
            {events.map((event, index) => (
              <div key={event.id || index} className="admin-event-card">
                <img src={event.IMG} alt={event.name} className="admin-event-image" />
                <div className="admin-event-info">
                  <h3 className="admin-event-name">{event.name}</h3>
                  <p className="admin-event-venue">{event.stadium}</p>
                  <p className="admin-event-location">{event.city}, {event.state}</p>
                  <p className="admin-event-datetime">
                    {event.day} • {event.date} • {event.time}
                  </p>
                  <p className="admin-event-tickets">{event.tickets.length} tickets available</p>
                  {event.createdBy && (
                    <p className="admin-event-created-by">Created by: {event.createdBy}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage