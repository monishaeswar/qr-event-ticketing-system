import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-4 p-4">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h3 className="fw-bold">Create Account</h3>
                <p className="text-muted">Join to start booking events</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input type="text" className="form-control" placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone (optional)</label>
                  <input type="tel" className="form-control" placeholder="+91 9876543210"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input type="password" className="form-control" placeholder="Min. 6 characters"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                Already have an account? <Link to="/login" className="fw-semibold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
