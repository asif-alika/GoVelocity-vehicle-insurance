import { useState, useEffect } from 'react';
import { LuSettings, LuCircleCheck, LuSave } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/plans'), api.get('/agents/customers')])
      .then(([plansRes]) => {
        setPlans(plansRes.data);
        // Fetch current agent's coverage plans via the profile
        return api.get('/auth/me');
      })
      .then(res => {
        // We need to get the current coverage. For simplicity, let's query from the DB.
        // Since we don't have a direct endpoint, we'll use the plans endpoint and mark the ones we handle.
        // We'll need to check by trying the availability endpoint for each plan
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const togglePlan = (planId) => {
    setSelectedIds(prev => prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]);
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) { toast.error('Select at least one plan'); return; }
    setSaving(true);
    try {
      await api.put('/agents/plans', { plan_ids: selectedIds });
      toast.success('Coverage plans updated!');
    } catch (err) { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Manage Coverage Plans</h1><p>Select which plans you want to offer to customers</p></div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)', maxWidth: 600 }}>
        {plans.map(p => (
          <div
            key={p.plan_id}
            className="card"
            style={{
              cursor: 'pointer', padding: 'var(--spacing-lg)',
              borderColor: selectedIds.includes(p.plan_id) ? 'var(--primary)' : undefined,
              background: selectedIds.includes(p.plan_id) ? 'rgba(108,99,255,0.08)' : undefined,
            }}
            onClick={() => togglePlan(p.plan_id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{p.plan_name}</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{p.tier} Tier — {formatCurrency(p.base_price)}/yr</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{p.description?.substring(0, 80)}...</div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${selectedIds.includes(p.plan_id) ? 'var(--primary)' : 'var(--border-color)'}`,
                background: selectedIds.includes(p.plan_id) ? 'var(--primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {selectedIds.includes(p.plan_id) && <LuCircleCheck size={16} color="white" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn btn-primary btn-lg" disabled={saving} style={{ marginTop: 'var(--spacing-2xl)' }}>
        {saving ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : <><LuSave size={18} /> Save Changes</>}
      </button>
    </div>
  );
};

export default ManagePlans;
