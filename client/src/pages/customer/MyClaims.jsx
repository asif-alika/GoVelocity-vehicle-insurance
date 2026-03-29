import { useState, useEffect } from 'react';
import { LuClipboardList, LuCircleCheck } from 'react-icons/lu';
import api from '../../services/api';
import { formatDate, getStatusClass, formatCurrency } from '../../utils/formatters';
import '../Dashboard.css';

const statuses = ['Submitted', 'Under Review', 'Inspection', 'Approved', 'Settled'];

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/claims').then(res => setClaims(res.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  const getStepIndex = (status) => {
    if (status === 'Rejected') return -1;
    return statuses.indexOf(status);
  };

  return (
    <div>
      <div className="page-header"><h1>My Claims</h1><p>Track the status of your insurance claims</p></div>
      {claims.length === 0 ? (
        <div className="empty-state"><LuClipboardList size={60} /><h3>No Claims Filed</h3><p>Your claims history will appear here.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {claims.map(c => {
            const stepIdx = getStepIndex(c.status);
            return (
              <div key={c.claim_id} className="claim-card">
                <div className="claim-card-header">
                  <div><div className="claim-card-type">{c.claim_type}</div><div className="claim-card-number">{c.claim_number}</div></div>
                  <span className={`badge ${getStatusClass(c.status)}`}>{c.status}</span>
                </div>

                {/* Timeline */}
                <div className="claim-timeline">
                  {statuses.map((s, i) => (
                    <div key={s} style={{ display: 'contents' }}>
                      <div className="timeline-step">
                        <div className={`timeline-dot ${i < stepIdx ? 'completed' : i === stepIdx ? 'active' : ''} ${c.status === 'Rejected' && i === 1 ? 'rejected' : ''}`}>
                          {i <= stepIdx ? <LuCircleCheck size={14} /> : i + 1}
                        </div>
                        <span className="timeline-label">{s}</span>
                      </div>
                      {i < statuses.length - 1 && <div className={`timeline-connector ${i < stepIdx ? 'active' : ''}`}></div>}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)', padding: 'var(--spacing-md) 0', borderTop: '1px solid var(--border-light)' }}>
                  <div><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Vehicle</span><span style={{ fontSize: 'var(--fs-sm)' }}>{c.make_name} {c.model_name}</span></div>
                  <div><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Filed On</span><span style={{ fontSize: 'var(--fs-sm)' }}>{formatDate(c.filed_date)}</span></div>
                  <div><span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Estimated</span><span style={{ fontSize: 'var(--fs-sm)' }}>{c.estimated_amount ? formatCurrency(c.estimated_amount) : '—'}</span></div>
                </div>
                {c.agent_remarks && (
                  <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Agent Remarks:</strong> {c.agent_remarks}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
