import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShield, LuCar, LuUser, LuUserCheck, LuCreditCard, LuArrowLeft } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const PolicySummary = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [nominee, setNominee] = useState({ full_name: '', relationship: '', date_of_birth: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  const plan = JSON.parse(sessionStorage.getItem('gv_selected_plan') || 'null');
  const agent = JSON.parse(sessionStorage.getItem('gv_selected_agent') || 'null');

  useEffect(() => {
    if (!plan || !agent) { navigate('/customer/plans'); return; }
    api.get('/vehicles').then(res => setVehicles(res.data));
  }, []);

  const handlePurchase = async () => {
    if (!selectedVehicle) { toast.error('Please select a vehicle'); return; }
    if (!nominee.full_name || !nominee.relationship) { toast.error('Please fill nominee details'); return; }

    setLoading(true);
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const res = await api.post('/policies', {
        vehicle_id: selectedVehicle,
        plan_id: plan.plan_id,
        agent_id: agent.agent_id,
        start_date: startDate,
        nominee
      });

      sessionStorage.setItem('gv_policy_id', res.data.policy_id);
      sessionStorage.setItem('gv_premium', res.data.premium_amount);
      navigate('/customer/payment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <LuArrowLeft size={16} /> Back
        </button>
        <h1>Policy Summary</h1>
        <p>Review your selections and complete the purchase</p>
      </div>

      <div style={{ maxWidth: 700 }}>
        {/* Plan Summary */}
        <div className="summary-section card-flat" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3><LuShield size={18} /> Coverage Plan</h3>
          <div className="summary-grid">
            <div className="summary-item"><label>Plan</label><span>{plan?.plan_name}</span></div>
            <div className="summary-item"><label>Tier</label><span>{plan?.tier}</span></div>
            <div className="summary-item"><label>Duration</label><span>{plan?.duration_months} months</span></div>
            <div className="summary-item"><label>Premium</label><span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>{formatCurrency(plan?.base_price)}</span></div>
          </div>
        </div>

        {/* Agent Summary */}
        <div className="summary-section card-flat" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3><LuUserCheck size={18} /> Assigned Agent</h3>
          <div className="summary-grid">
            <div className="summary-item"><label>Name</label><span>{agent?.first_name} {agent?.last_name}</span></div>
            <div className="summary-item"><label>Region</label><span>{agent?.city}, {agent?.state}</span></div>
          </div>
        </div>

        {/* Select Vehicle */}
        <div className="summary-section card-flat" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3><LuCar size={18} /> Select Vehicle</h3>
          <div className="input-group">
            <select value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)}>
              <option value="">Choose a vehicle</option>
              {vehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_id}>{v.make_name} {v.model_name} — {v.registration_number}</option>
              ))}
            </select>
          </div>
          {vehicles.length === 0 && (
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--accent)', marginTop: 'var(--spacing-sm)' }}>
              You need to add a vehicle first. <a href="/customer/vehicles/add">Add one now →</a>
            </p>
          )}
        </div>

        {/* Nominee */}
        <div className="summary-section card-flat" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3><LuUser size={18} /> Nominee Details</h3>
          <div className="auth-form">
            <div className="form-row">
              <div className="input-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Nominee full name" value={nominee.full_name} onChange={e => setNominee(prev => ({ ...prev, full_name: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Relationship *</label>
                <select value={nominee.relationship} onChange={e => setNominee(prev => ({ ...prev, relationship: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Phone</label>
                <input type="tel" placeholder="Optional" value={nominee.phone} onChange={e => setNominee(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="Optional" value={nominee.email} onChange={e => setNominee(prev => ({ ...prev, email: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handlePurchase} className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
          {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : <><LuCreditCard size={18} /> Proceed to Payment — {formatCurrency(plan?.base_price)}</>}
        </button>
      </div>
    </div>
  );
};

export default PolicySummary;
