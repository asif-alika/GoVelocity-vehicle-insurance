import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuZap, LuArrowRight, LuArrowLeft, LuUser, LuMapPin, LuFileText, LuCircleCheck } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const RegisterCustomer = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirm_password: '',
    phone: '', date_of_birth: '', gender: '',
    address_line1: '', address_line2: '', city: '', state: '', pincode: '',
    id_proof_type: '', id_proof_number: ''
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const nextStep = () => {
    if (step === 1) {
      if (!form.first_name || !form.last_name || !form.email || !form.password || !form.phone || !form.date_of_birth || !form.gender) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (form.password !== form.confirm_password) {
        toast.error('Passwords do not match');
        return;
      }
      if (form.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    if (step === 2) {
      if (!form.address_line1 || !form.city || !form.state || !form.pincode) {
        toast.error('Please fill in all required address fields');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { confirm_password, ...data } = form;
      await registerCustomer(data);
      toast.success('Registration successful! Welcome to GoVelocity.');
      navigate('/customer/dashboard');
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

      <motion.div
        className="auth-container register"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="auth-logo">
          <div className="landing-logo-icon"><LuZap size={22} /></div>
          <span className="landing-logo-text">GoVelocity</span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join GoVelocity as a customer</p>
          </div>

          {/* Steps */}
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

          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="step-content">
              <h3 className="step-title"><LuUser size={20} /> Personal Details</h3>
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
                    <input type="password" placeholder="Re-enter password" value={form.confirm_password} onChange={e => update('confirm_password', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Phone *</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Date of Birth *</label>
                    <input type="date" value={form.date_of_birth} onChange={e => update('date_of_birth', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Gender *</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="step-actions">
                  <Link to="/login" className="btn btn-secondary">Back to Login</Link>
                  <button className="btn btn-primary" onClick={nextStep}>Next <LuArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="step-content">
              <h3 className="step-title"><LuMapPin size={20} /> Address</h3>
              <div className="auth-form">
                <div className="input-group">
                  <label>Address Line 1 *</label>
                  <input type="text" placeholder="House/Flat No., Street" value={form.address_line1} onChange={e => update('address_line1', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Address Line 2</label>
                  <input type="text" placeholder="Landmark, Area (Optional)" value={form.address_line2} onChange={e => update('address_line2', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>City *</label>
                    <input type="text" placeholder="Mumbai" value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>State *</label>
                    <input type="text" placeholder="Maharashtra" value={form.state} onChange={e => update('state', e.target.value)} />
                  </div>
                </div>
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <label>Pincode *</label>
                  <input type="text" placeholder="400001" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                </div>
                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}><LuArrowLeft size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={nextStep}>Next <LuArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: ID Proof */}
          {step === 3 && (
            <div className="step-content">
              <h3 className="step-title"><LuFileText size={20} /> ID Verification (Optional)</h3>
              <div className="auth-form">
                <div className="input-group">
                  <label>ID Proof Type</label>
                  <select value={form.id_proof_type} onChange={e => update('id_proof_type', e.target.value)}>
                    <option value="">Select (Optional)</option>
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="DL">Driving License</option>
                  </select>
                </div>
                {form.id_proof_type && (
                  <div className="input-group">
                    <label>{form.id_proof_type} Number</label>
                    <input type="text" placeholder={`Enter your ${form.id_proof_type} number`} value={form.id_proof_number} onChange={e => update('id_proof_number', e.target.value)} />
                  </div>
                )}
                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(2)}><LuArrowLeft size={16} /> Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : <>Create Account <LuArrowRight size={16} /></>}
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

export default RegisterCustomer;
