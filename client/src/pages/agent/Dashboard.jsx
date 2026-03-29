import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuUsers, LuShield, LuClipboardList, LuTrendingUp, LuIndianRupee, LuArrowRight } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/formatters';
import '../Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/agent-dashboard').then(res => setData(res.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  const stats = data?.stats || {};

  return (
    <div>
      <div className="page-header"><h1>Agent Dashboard 🏢</h1><p>Overview of your insurance business</p></div>
      <div className="stats-cards">
        <div className="stat-card"><div className="stat-card-header"><div className="stat-card-icon purple"><LuUsers size={22} /></div><LuTrendingUp size={16} color="var(--secondary)" /></div><div className="stat-card-value">{stats.total_customers || 0}</div><div className="stat-card-label">Total Customers</div></div>
        <div className="stat-card"><div className="stat-card-header"><div className="stat-card-icon teal"><LuShield size={22} /></div></div><div className="stat-card-value">{stats.active_policies || 0}</div><div className="stat-card-label">Active Policies</div></div>
        <div className="stat-card"><div className="stat-card-header"><div className="stat-card-icon coral"><LuClipboardList size={22} /></div></div><div className="stat-card-value">{stats.submitted_claims || 0}</div><div className="stat-card-label">Pending Review</div></div>
        <div className="stat-card"><div className="stat-card-header"><div className="stat-card-icon gold"><LuIndianRupee size={22} /></div></div><div className="stat-card-value">{formatCurrency(stats.total_revenue || 0)}</div><div className="stat-card-label">Total Revenue</div></div>
      </div>

      {data?.pending_claims?.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header"><h2>Pending Claims</h2><Link to="/agent/claims" className="btn btn-ghost btn-sm">View All <LuArrowRight size={14} /></Link></div>
          <div className="table-container">
            <table>
              <thead><tr><th>Claim</th><th>Customer</th><th>Vehicle</th><th>Status</th><th>Filed</th><th></th></tr></thead>
              <tbody>
                {data.pending_claims.map(c => (
                  <tr key={c.claim_id}>
                    <td><strong>{c.claim_number}</strong><br /><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{c.claim_type}</span></td>
                    <td>{c.first_name} {c.last_name}</td>
                    <td>{c.make_name} {c.model_name}</td>
                    <td><span className={`badge ${getStatusClass(c.status)}`}>{c.status}</span></td>
                    <td>{formatDate(c.filed_date)}</td>
                    <td><Link to={`/agent/claims/${c.claim_id}/review`} className="btn btn-primary btn-sm">Review</Link></td>
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

export default Dashboard;
