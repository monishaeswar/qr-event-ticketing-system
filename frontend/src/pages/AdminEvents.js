import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CATEGORIES = ['Conference', 'Concert', 'Workshop', 'Seminar', 'Sports', 'Other'];

const emptyForm = { title: '', description: '', date: '', time: '', venue: '', category: 'Other', ticketPrice: '', totalSeats: '' };

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('/api/events');
      setEvents(data.events);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/events/${editingId}`, form);
        toast.success('Event updated!');
      } else {
        await axios.post('/api/events', form);
        toast.success('Event created!');
      }
      setForm(emptyForm); setEditingId(null); setShowForm(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title, description: event.description,
      date: event.date.substring(0, 10), time: event.time,
      venue: event.venue, category: event.category,
      ticketPrice: event.ticketPrice, totalSeats: event.totalSeats,
    });
    setEditingId(event._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this event?')) return;
    try {
      await axios.delete(`/api/events/${id}`);
      toast.success('Event deactivated');
      fetchEvents();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title fw-bold mb-0">Manage Events</h2>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancel' : '+ New Event'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h5 className="fw-bold mb-3">{editingId ? 'Edit Event' : 'Create New Event'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Event Title *</label>
                <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Date *</label>
                <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Time *</label>
                <input type="time" className="form-control" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Venue *</label>
                <input className="form-control" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Ticket Price (₹) *</label>
                <input type="number" className="form-control" min="0" value={form.ticketPrice} onChange={e => setForm({ ...form, ticketPrice: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Total Seats *</label>
                <input type="number" className="form-control" min="1" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary px-5" disabled={submitting}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : editingId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
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
                {events.map(event => (
                  <tr key={event._id}>
                    <td className="fw-semibold">{event.title}</td>
                    <td><span className="badge bg-secondary">{event.category}</span></td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td className="text-muted small">{event.venue}</td>
                    <td>₹{event.ticketPrice}</td>
                    <td>
                      <span className={`badge ${event.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {event.availableSeats}/{event.totalSeats}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(event)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(event._id)}>Delete</button>
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
