import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createEvent } from '../services/eventService';
import Button from '../components/Button';

const CATEGORIES = ['Conference', 'Concert', 'Workshop', 'Seminar', 'Sports', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  category: 'Other',
  ticketPrice: '',
  totalSeats: '',
};

const CreateEvent = () => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEvent(form);
      toast.success('Event created!');
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="page-title fw-bold mb-4">Create New Event</h2>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Event Title *</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Time *</label>
              <input
                type="time"
                className="form-control"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Venue *</label>
              <input
                className="form-control"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Ticket Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={form.ticketPrice}
                onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Total Seats *</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={form.totalSeats}
                onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
                required
              />
            </div>
            <div className="col-12">
              <Button type="submit" className="px-5" loading={submitting} loadingText="Saving...">
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
