import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuUser, LuCar, LuShield, LuClipboardList, LuFileText, LuCircleCheck, LuClock } from 'react-icons/lu';
import api from '../../services/api';
import { formatDate, getStatusClass, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get(`/agents/customers/${id}`).then(res => setData(res.data)).catch(() => {}).finally(() => setLoading(false)); }, [id]);

  const verifyDoc = async (docId) => {
    try { await api.put(`/documents/${docId}/verify`); toast.success('Document verified!'); api.get(`/agents/customers/${id}`).then(res => setData(res.data)); }
    catch { toast.error('Verification failed'); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!data) return <div className="empty-state"><h3>Customer Not Found</h3></div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}><LuArrowLeft size={16} /> Back</button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-xl)', fontWeight: 700, color: 'white', flexShrink: 0 }}>
          {data.first_name?.[0]}{data.last_name?.[0]}
        </div>
        <div>
          <h2>{data.first_name} {data.last_name}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{data.email} • {data.phone}</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>{data.city}, {data.state} • Member since {formatDate(data.created_at)}</p>
        </div>
      </div>

      {/* Vehicles */}
      <div className="dashboard-section">
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}><LuCar size={18} /> Vehicles ({data.vehicles?.length || 0})</h2>
        <div className="card-grid">
          {data.vehicles?.map(v => (
            <div key={v.vehicle_id} className="vehicle-card">
              <div className="vehicle-icon"><LuCar size={24} /></div>
              <div className="vehicle-info"><h3>{v.make_name} {v.model_name}</h3><p>{v.vehicle_type} • {v.fuel_type}</p><span className="vehicle-reg">{v.registration_number}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Policies */}
      <div className="dashboard-section">
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}><LuShield size={18} /> Policies ({data.policies?.length || 0})</h2>
        {data.policies?.map(p => (
          <div key={p.policy_id} className="policy-card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <div className="policy-card-header"><div><div className="policy-card-title">{p.plan_name}</div><div className="policy-card-number">{p.policy_number}</div></div><span className={`badge ${getStatusClass(p.status)}`}>{p.status}</span></div>
            <div className="policy-card-body">
              <div className="policy-card-field"><label>Premium</label><span>{formatCurrency(p.premium_amount)}</span></div>
              <div className="policy-card-field"><label>Valid Till</label><span>{formatDate(p.end_date)}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="dashboard-section">
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}><LuFileText size={18} /> Documents ({data.documents?.length || 0})</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {data.documents?.map(d => (
            <div key={d.document_id} className="doc-card">
              <div className="doc-icon"><LuFileText size={20} /></div>
              <div className="doc-info"><h4>{d.document_type}</h4><p>{d.document_name}</p></div>
              {d.is_verified ? (
                <span className="badge badge-success"><LuCircleCheck size={12} /> Verified</span>
              ) : (
                <button onClick={() => verifyDoc(d.document_id)} className="btn btn-success btn-sm"><LuCircleCheck size={14} /> Verify</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
