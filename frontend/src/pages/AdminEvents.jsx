import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listEvents, deleteEvent } from '../services/eventService';
import Loader from '../components/Loader';
import { formatShortDate, formatCurrency } from '../utils/formatters';

// Lists events for admin management, with links out to the dedicated
// CreateEvent / EditEvent pages (kept separate from this list per the
// project's page structure).
const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await listEvents();
      setEvents(data.events);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this event?')) return;
    try {
      await deleteEvent(id);
      toast.success('Event deactivated');
      fetchEvents();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title fw-bold mb-0">Manage Events</h2>
        <Link to="/admin/events/new" className="btn btn-primary">+ New Event</Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th><th>Category</th><th>Date</th><th>Venue</th>
                  <th>Price</th><th>Seats Left</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="fw-semibold">{event.title}</td>
                    <td><span className="badge bg-secondary">{event.category}</span></td>
                    <td>{formatShortDate(event.date)}</td>
                    <td className="text-muted small">{event.venue}</td>
                    <td>{formatCurrency(event.ticketPrice)}</td>
                    <td>
                      <span className={`badge ${event.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {event.availableSeats}/{event.totalSeats}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link className="btn btn-sm btn-outline-primary" to={`/admin/events/${event._id}/edit`}>
                          Edit
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(event._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
