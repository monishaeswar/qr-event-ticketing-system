import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEvents } from '../services/eventService';
import EventCard from '../components/EventCard';

const FEATURES = [
  { icon: '🔍', title: 'Browse Events', desc: 'Explore events by category, date, or keyword.' },
  { icon: '🎫', title: 'Book Tickets', desc: 'Select quantity and book your seat instantly.' },
  { icon: '📧', title: 'Get QR Ticket', desc: 'Receive your digital ticket with QR code via email.' },
  { icon: '✅', title: 'Easy Check-In', desc: 'Scan QR at the venue for instant validation.' },
];

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    listEvents()
      .then(({ data }) => setFeaturedEvents(data.events.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero-section text-white py-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">Book Events, Get QR Tickets</h1>
          <p className="lead mb-4 opacity-75">
            Discover amazing events, book instantly, and receive digital QR tickets via email.
            Seamless check-in at the venue.
          </p>
          <Link to="/events" className="btn btn-light btn-lg px-5 fw-semibold shadow">
            🎟 Browse Events
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4 text-center">
            {FEATURES.map((f, i) => (
              <div className="col-md-3" key={i}>
                <div className="card border-0 shadow-sm h-100 p-4 rounded-4">
                  <div style={{ fontSize: '3rem' }}>{f.icon}</div>
                  <h5 className="fw-bold mt-3">{f.title}</h5>
                  <p className="text-muted small">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold page-title mb-0">Upcoming Events</h2>
              <Link to="/events" className="btn btn-outline-primary">View All →</Link>
            </div>
            <div className="row g-4">
              {featuredEvents.map((event) => (
                <div className="col-md-4" key={event._id}>
                  <EventCard event={event} compact />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
