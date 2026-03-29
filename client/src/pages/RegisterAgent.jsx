import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuZap, LuArrowRight, LuArrowLeft, LuUser, LuMapPin, LuShield, LuCircleCheck } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

const RegisterAgent = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const { registerAgent } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirm_password: '',
    phone: '', license_number: '', region: '',
    office_address: '', city: '', state: '', pincode: '',
    plan_ids: []
  });

  useEffect(() => {
    api.get('/plans').then(res => setPlans(res.data)).catch(() => {});
  }, []);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const togglePlan = (planId) => {
    setForm(prev => ({
      ...prev,
      plan_ids: prev.plan_ids.includes(planId)
        ? prev.plan_ids.filter(id => id !== planId)
        : [...prev.plan_ids, planId]
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.first_name || !form.last_name || !form.email || !form.password || !form.phone || !form.license_number) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (form.password !== form.confirm_password) {
        toast.error('Passwords do not match');
        return;
      }
    }
    if (step === 2) {
      if (!form.region || !form.city || !form.state || !form.pincode) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (form.plan_ids.length === 0) {
      toast.error('Please select at least one coverage plan');
      return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...data } = form;
      await registerAgent(data);
      toast.success('Agent registration successful!');
      navigate('/agent/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <motion.div className="auth-container register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="auth-logo">
          <div className="landing-logo-icon"><LuZap size={22} /></div>
          <span className="landing-logo-text">GoVelocity</span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>Become an Agent</h1>
            <p>Partner with GoVelocity and grow your insurance business</p>
          </div>

          <div className="step-indicator">
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`step-dot ${step === s ? 'active' : step > s ? 'completed' : ''}`}>
                  {step > s ? <LuCircleCheck size={16} /> : s}
                </div>
                {i < 2 && <div className={`step-line ${step > s ? 'active' : ''}`}></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="step-content">
              <h3 className="step-title"><LuUser size={20} /> Personal & License</h3>
              <div className="auth-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>First Name *</label>
                    <input type="text" placeholder="John" value={form.first_name} onChange={e => update('first_name', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Last Name *</label>
                    <input type="text" placeholder="Doe" value={form.last_name} onChange={e => update('last_name', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Email *</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Password *</label>
                    <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => update('password', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Confirm Password *</label>
                    <input type="password" placeholder="Re-enter" value={form.confirm_password} onChange={e => update('confirm_password', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Phone *</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>License Number *</label>
                    <input type="text" placeholder="AGT-XXXX-XXXX" value={form.license_number} onChange={e => update('license_number', e.target.value)} />
                  </div>
                </div>
                <div className="step-actions">
                  <Link to="/login" className="btn btn-secondary">Back to Login</Link>
                  <button className="btn btn-primary" onClick={nextStep}>Next <LuArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3 className="step-title"><LuMapPin size={20} /> Office & Region</h3>
              <div className="auth-form">
                <div className="input-group">
                  <label>Region / Territory *</label>
                  <input type="text" placeholder="e.g. Western Maharashtra" value={form.region} onChange={e => update('region', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Office Address</label>
                  <input type="text" placeholder="Office address (Optional)" value={form.office_address} onChange={e => update('office_address', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>City *</label>
                    <input type="text" placeholder="Pune" value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>State *</label>
                    <input type="text" placeholder="Maharashtra" value={form.state} onChange={e => update('state', e.target.value)} />
                  </div>
                </div>
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <label>Pincode *</label>
                  <input type="text" placeholder="411001" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                </div>
                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}><LuArrowLeft size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={nextStep}>Next <LuArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3 className="step-title"><LuShield size={20} /> Select Coverage Plans</h3>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--spacing-lg)' }}>
                Choose the plans you'll sell to customers
              </p>
              <div className="auth-form">
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                  {plans.map(plan => (
                    <div
                      key={plan.plan_id}
                      className={`card ${form.plan_ids.includes(plan.plan_id) ? '' : ''}`}
                      style={{
                        cursor: 'pointer',
                        padding: 'var(--spacing-lg)',
                        borderColor: form.plan_ids.includes(plan.plan_id) ? 'var(--primary)' : undefined,
                        background: form.plan_ids.includes(plan.plan_id) ? 'rgba(108, 99, 255, 0.08)' : undefined
                      }}
                      onClick={() => togglePlan(plan.plan_id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{plan.plan_name}</div>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{plan.tier} Tier — ₹{plan.base_price}/yr</div>
                        </div>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          border: `2px solid ${form.plan_ids.includes(plan.plan_id) ? 'var(--primary)' : 'var(--border-color)'}`,
                          background: form.plan_ids.includes(plan.plan_id) ? 'var(--primary)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {form.plan_ids.includes(plan.plan_id) && <LuCircleCheck size={14} color="white" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(2)}><LuArrowLeft size={16} /> Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : <>Register as Agent <LuArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterAgent;
