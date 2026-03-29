import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuClipboardList } from 'react-icons/lu';
import api from '../../services/api';
import { formatDate, getStatusClass, formatCurrency } from '../../utils/formatters';
import '../Dashboard.css';

const PendingClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { api.get('/claims').then(res => setClaims(res.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Claims Management</h1><p>Review and process customer claims</p></div>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
        {['all', 'Submitted', 'Under Review', 'Inspection', 'Approved', 'Rejected', 'Settled'].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s} {s !== 'all' && `(${claims.filter(c => c.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><LuClipboardList size={60} /><h3>No Claims</h3><p>No claims match the selected filter.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Claim No.</th><th>Customer</th><th>Type</th><th>Vehicle</th><th>Estimated</th><th>Filed</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.claim_id}>
                  <td><strong>{c.claim_number}</strong></td>
                  <td>{c.customer_first_name} {c.customer_last_name}</td>
                  <td>{c.claim_type}</td>
                  <td>{c.make_name} {c.model_name}<br /><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{c.registration_number}</span></td>
                  <td>{c.estimated_amount ? formatCurrency(c.estimated_amount) : '—'}</td>
                  <td>{formatDate(c.filed_date)}</td>
                  <td><span className={`badge ${getStatusClass(c.status)}`}>{c.status}</span></td>
                  <td><Link to={`/agent/claims/${c.claim_id}/review`} className="btn btn-primary btn-sm">Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingClaims;
