import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuStar, LuUsers, LuMapPin, LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const SelectAgent = () => {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const plan = JSON.parse(sessionStorage.getItem('gv_selected_plan') || 'null');

  useEffect(() => {
    if (!plan) { navigate('/customer/plans'); return; }
    api.get(`/agents/available/${plan.plan_id}`).then(res => setAgents(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const proceed = () => {
    if (!selected) { toast.error('Please select an agent'); return; }
    sessionStorage.setItem('gv_selected_agent', JSON.stringify(selected));
    navigate('/customer/policy-summary');
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <LuArrowLeft size={16} /> Back to Plans
        </button>
        <h1>Select Your Agent</h1>
        <p>Choose a verified agent who handles the <strong>{plan?.plan_name}</strong> plan</p>
      </div>

      {agents.length === 0 ? (
        <div className="empty-state">
          <LuUsers size={60} />
          <h3>No Agents Available</h3>
          <p>No agents are currently available for this plan. Please try a different plan.</p>
        </div>
      ) : (
        <>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {agents.map(a => (
              <div
                key={a.agent_id}
                className={`agent-card ${selected?.agent_id === a.agent_id ? 'selected' : ''}`}
                onClick={() => setSelected(a)}
              >
                <div className="agent-avatar">{a.first_name[0]}{a.last_name[0]}</div>
                <div className="agent-name">{a.first_name} {a.last_name}</div>
                <div className="agent-region"><LuMapPin size={14} /> {a.city}, {a.state}</div>
                <div className="agent-rating"><LuStar size={14} /> {a.rating}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-sm)' }}>
                  {a.total_customers} customers
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-2xl)' }}>
            <button onClick={proceed} className="btn btn-primary btn-lg" disabled={!selected}>
              Continue <LuArrowRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectAgent;
