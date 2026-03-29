import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuShield, LuCar, LuClipboardList, LuCreditCard, LuArrowRight, LuTrendingUp, LuPlus } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/formatters';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import '../Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/dashboard')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="skeleton skeleton-text lg" style={{ height: 32, width: 280, marginBottom: 12 }}></div>
          <div className="skeleton skeleton-text md" style={{ height: 18, width: 360 }}></div>
        </div>
        <SkeletonLoader type="stats" count={4} />
        <div style={{ marginTop: 'var(--spacing-2xl)' }}>
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div>
      <div className="page-header">
        <h1>Welcome Back! 👋</h1>
        <p>Here's an overview of your insurance portfolio</p>
      </div>

      {/* Stats */}
      <div className="stats-cards stagger-children">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon purple"><LuShield size={22} /></div>
            <LuTrendingUp size={16} color="var(--secondary)" />
          </div>
          <div className="stat-card-value">{stats.active_policies || 0}</div>
          <div className="stat-card-label">Active Policies</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon teal"><LuCar size={22} /></div>
          </div>
          <div className="stat-card-value">{stats.total_vehicles || 0}</div>
          <div className="stat-card-label">Registered Vehicles</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon coral"><LuClipboardList size={22} /></div>
          </div>
          <div className="stat-card-value">{stats.pending_claims || 0}</div>
          <div className="stat-card-label">Pending Claims</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon gold"><LuCreditCard size={22} /></div>
          </div>
          <div className="stat-card-value">{stats.total_policies || 0}</div>
          <div className="stat-card-label">Total Policies</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <Link to="/customer/vehicles/add" className="btn btn-secondary"><LuPlus size={16} /> Add Vehicle</Link>
          <Link to="/customer/plans" className="btn btn-primary"><LuShield size={16} /> Get New Policy</Link>
          <Link to="/customer/claims/new" className="btn btn-secondary"><LuClipboardList size={16} /> File a Claim</Link>
        </div>
      </div>

      {/* Recent Policies */}
      {data?.recent_policies?.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Policies</h2>
            <Link to="/customer/policies" className="btn btn-ghost btn-sm">View All <LuArrowRight size={14} /></Link>
          </div>
          <div className="card-grid stagger-children">
            {data.recent_policies.map(p => (
              <div key={p.policy_id} className="policy-card">
                <div className="policy-card-header">
                  <div>
                    <div className="policy-card-title">{p.plan_name}</div>
                    <div className="policy-card-number">{p.policy_number}</div>
                  </div>
                  <span className={`badge ${getStatusClass(p.status)}`}>{p.status}</span>
                </div>
                <div className="policy-card-body">
                  <div className="policy-card-field">
                    <label>Vehicle</label>
                    <span>{p.make_name} {p.model_name}</span>
                  </div>
                  <div className="policy-card-field">
                    <label>Reg. No.</label>
                    <span>{p.registration_number}</span>
                  </div>
                  <div className="policy-card-field">
                    <label>Coverage</label>
                    <span>{p.tier}</span>
                  </div>
                  <div className="policy-card-field">
                    <label>Valid Till</label>
                    <span>{formatDate(p.end_date)}</span>
                  </div>
                </div>
                <div className="policy-card-footer">
                  <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--primary)' }}>
                    {formatCurrency(p.premium_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats.total_policies === 0 && (
        <div className="empty-state">
          <LuShield size={60} />
          <h3>No Policies Yet</h3>
          <p>Get started by adding a vehicle and exploring our coverage plans.</p>
          <Link to="/customer/plans" className="btn btn-primary">Browse Plans <LuArrowRight size={16} /></Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
