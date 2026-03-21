import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Conference', 'Concert', 'Workshop', 'Seminar', 'Sports', 'Other'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await axios.get('/api/events', { params });
      setEvents(data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="container py-5">
      <h2 className="page-title fw-bold mb-4">Browse Events</h2>

      {/* Search & Filter */}
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-7">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input type="text" className="form-control" placeholder="Search events..."
                value={search} onChange={e => setSearch(e.target.value)} />
              <button type="submit" className="btn btn-primary px-4">Search</button>
            </form>
          </div>
          <div className="col-md-5">
            <div className="d-flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat}
                  className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCategory(cat)}>{cat}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🎭</div>
          <h4 className="text-muted">No events found</h4>
        </div>
      ) : (
        <div className="row g-4">
          {events.map(event => (
            <div className="col-md-4 col-sm-6" key={event._id}>
              <div className="card event-card shadow-sm h-100">
                <div className="position-relative" style={{ background: 'linear-gradient(135deg,#667eea22,#764ba233)', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '4rem' }}>
                    {event.category === 'Concert' ? '🎵' : event.category === 'Conference' ? '💼' : event.category === 'Sports' ? '⚽' : event.category === 'Workshop' ? '🔧' : '🎪'}
                  </span>
                  <span className="badge bg-primary position-absolute top-0 end-0 m-2">{event.category}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{event.title}</h5>
                  <p className="text-muted small">{event.description.substring(0, 80)}...</p>
                  <div className="d-flex flex-column gap-1 mb-2">
                    <span className="text-muted small">📅 {new Date(event.date).toDateString()} at {event.time}</span>
                    <span className="text-muted small">📍 {event.venue}</span>
                    <span className="text-muted small">💺 {event.availableSeats} seats left</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold text-primary fs-5">₹{event.ticketPrice}</span>
                    <span className={`badge ${event.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {event.availableSeats > 0 ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                  <Link to={`/events/${event._id}`} className="btn btn-primary w-100">View & Book</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
