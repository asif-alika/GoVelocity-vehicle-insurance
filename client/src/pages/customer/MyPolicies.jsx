import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuShield, LuArrowRight } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/formatters';
import '../Dashboard.css';

const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/policies').then(res => setPolicies(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>My Policies</h1><p>View and manage your insurance policies</p></div>
        <Link to="/customer/plans" className="btn btn-primary"><LuShield size={16} /> New Policy</Link>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state"><LuShield size={60} /><h3>No Policies Yet</h3><p>Browse our plans and get insured today.</p>
          <Link to="/customer/plans" className="btn btn-primary">Browse Plans <LuArrowRight size={16} /></Link>
        </div>
      ) : (
        <div className="card-grid">
          {policies.map(p => (
            <div key={p.policy_id} className="policy-card">
              <div className="policy-card-header">
                <div><div className="policy-card-title">{p.plan_name}</div><div className="policy-card-number">{p.policy_number}</div></div>
                <span className={`badge ${getStatusClass(p.status)}`}>{p.status}</span>
              </div>
              <div className="policy-card-body">
                <div className="policy-card-field"><label>Vehicle</label><span>{p.make_name} {p.model_name}</span></div>
                <div className="policy-card-field"><label>Reg. No.</label><span>{p.registration_number}</span></div>
                <div className="policy-card-field"><label>Coverage</label><span>{p.tier}</span></div>
                <div className="policy-card-field"><label>Valid Till</label><span>{formatDate(p.end_date)}</span></div>
                <div className="policy-card-field"><label>Agent</label><span>{p.agent_first_name} {p.agent_last_name}</span></div>
                {p.nominee_name && <div className="policy-card-field"><label>Nominee</label><span>{p.nominee_name} ({p.nominee_relationship})</span></div>}
              </div>
              <div className="policy-card-footer">
                <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(p.premium_amount)}</span>
                {p.status === 'Active' && <Link to="/customer/claims/new" className="btn btn-ghost btn-sm">File Claim</Link>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
