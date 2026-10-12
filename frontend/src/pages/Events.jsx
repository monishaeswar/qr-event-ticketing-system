import React, { useEffect, useState } from 'react';
import { listEvents } from '../services/eventService';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Conference', 'Concert', 'Workshop', 'Seminar', 'Sports', 'Other'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await listEvents(params);
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
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-4">Search</button>
            </form>
          </div>
          <div className="col-md-5">
            <div className="d-flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🎭</div>
          <h4 className="text-muted">No events found</h4>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div className="col-md-4 col-sm-6" key={event._id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
