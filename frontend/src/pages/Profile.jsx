import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../services/authService';
import Button from '../components/Button';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await updateProfile(form);
      refreshUser({ ...user, ...data.user });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await changePassword(pwForm);
      toast.success('Password updated');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h2 className="page-title fw-bold mb-4">My Profile</h2>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-bold mb-3">Account Details</h5>
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input className="form-control" value={user.email} disabled />
            <div className="form-text">Email cannot be changed.</div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Phone</label>
            <input
              type="tel"
              className="form-control"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <Button type="submit" loading={savingProfile} loadingText="Saving...">
            Save Changes
          </Button>
        </form>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold mb-3">Change Password</h5>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Current Password</label>
            <input
              type="password"
              className="form-control"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control"
              minLength={6}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              required
            />
          </div>
          <Button type="submit" variant="outline-primary" loading={savingPassword} loadingText="Updating...">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
