import { useState, useEffect } from 'react';
import { LuUser, LuSave } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header"><h1>My Profile</h1><p>View your account information</p></div>
      <div className="card" style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'white' }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <h2>{user?.first_name} {user?.last_name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            <span className="badge badge-info" style={{ marginTop: 4 }}>{user?.role}</span>
          </div>
        </div>
        <div className="summary-grid">
          <div className="summary-item"><label>Phone</label><span>{user?.phone || '—'}</span></div>
          <div className="summary-item"><label>Date of Birth</label><span>{formatDate(user?.date_of_birth)}</span></div>
          <div className="summary-item"><label>Gender</label><span>{user?.gender || '—'}</span></div>
          <div className="summary-item"><label>City</label><span>{user?.city || '—'}</span></div>
          <div className="summary-item"><label>State</label><span>{user?.state || '—'}</span></div>
          <div className="summary-item"><label>Pincode</label><span>{user?.pincode || '—'}</span></div>
          <div className="summary-item"><label>Member Since</label><span>{formatDate(user?.created_at)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
