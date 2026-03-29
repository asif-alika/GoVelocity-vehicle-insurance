import { useState, useEffect } from 'react';
import { LuShield } from 'react-icons/lu';
import api from '../../services/api';
import { formatDate, getStatusClass, formatCurrency } from '../../utils/formatters';
import '../Dashboard.css';

const ManagedPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/policies').then(res => setPolicies(res.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Managed Policies</h1><p>All policies assigned to you</p></div>
      {policies.length === 0 ? (
        <div className="empty-state"><LuShield size={60} /><h3>No Policies Yet</h3><p>Policies will appear here when customers purchase through you.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Policy No.</th><th>Customer</th><th>Plan</th><th>Vehicle</th><th>Premium</th><th>Valid Till</th><th>Status</th></tr></thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.policy_id}>
                  <td><strong>{p.policy_number}</strong></td>
                  <td>{p.customer_first_name} {p.customer_last_name}<br /><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{p.customer_email}</span></td>
                  <td>{p.plan_name}<br /><span className="badge badge-info" style={{ marginTop: 2 }}>{p.tier}</span></td>
                  <td>{p.make_name} {p.model_name}<br /><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{p.registration_number}</span></td>
                  <td>{formatCurrency(p.premium_amount)}</td>
                  <td>{formatDate(p.end_date)}</td>
                  <td><span className={`badge ${getStatusClass(p.status)}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagedPolicies;
