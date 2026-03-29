import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuCreditCard, LuCircleCheck, LuCircleX, LuSmartphone, LuBanknote, LuWallet } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const Payment = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const policyId = sessionStorage.getItem('gv_policy_id');
  const premium = parseFloat(sessionStorage.getItem('gv_premium') || '0');

  const methods = [
    { value: 'Credit Card', icon: LuCreditCard, label: 'Credit Card' },
    { value: 'Debit Card', icon: LuCreditCard, label: 'Debit Card' },
    { value: 'UPI', icon: LuSmartphone, label: 'UPI' },
    { value: 'Net Banking', icon: LuBanknote, label: 'Net Banking' },
    { value: 'Wallet', icon: LuWallet, label: 'Wallet' },
  ];

  const handlePayment = async () => {
    if (!method) { toast.error('Please select a payment method'); return; }
    setProcessing(true);

    // Simulate delay
    await new Promise(r => setTimeout(r, 2000));

    try {
      const res = await api.post('/payments', { policy_id: policyId, payment_method: method });
      setResult(res.data);
      if (res.data.payment.status === 'Success') {
        sessionStorage.removeItem('gv_selected_plan');
        sessionStorage.removeItem('gv_selected_agent');
        sessionStorage.removeItem('gv_policy_id');
        sessionStorage.removeItem('gv_premium');
      }
    } catch (err) {
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  // Result screen
  if (result) {
    const isSuccess = result.payment.status === 'Success';
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card"
          style={{ textAlign: 'center', maxWidth: 500, padding: 'var(--spacing-3xl)' }}
        >
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            {isSuccess ? (
              <LuCircleCheck size={72} color="var(--secondary)" />
            ) : (
              <LuCircleX size={72} color="var(--accent)" />
            )}
          </div>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            {result.message}
          </p>
          {isSuccess && (
            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Transaction ID</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)' }}>{result.payment.transaction_id}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            {isSuccess ? (
              <button onClick={() => navigate('/customer/policies')} className="btn btn-primary" style={{ flex: 1 }}>View My Policies</button>
            ) : (
              <>
                <button onClick={() => { setResult(null); setProcessing(false); }} className="btn btn-secondary" style={{ flex: 1 }}>Try Again</button>
                <button onClick={() => navigate('/customer/dashboard')} className="btn btn-ghost" style={{ flex: 1 }}>Go to Dashboard</button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: 500, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>Complete Payment</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2xl)' }}>
          Amount: <strong style={{ color: 'var(--primary)', fontSize: 'var(--fs-xl)' }}>{formatCurrency(premium)}</strong>
        </p>

        <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
          {methods.map(m => (
            <div
              key={m.value}
              onClick={() => setMethod(m.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)',
                border: `1px solid ${method === m.value ? 'var(--primary)' : 'var(--border-color)'}`,
                background: method === m.value ? 'rgba(108,99,255,0.08)' : 'var(--bg-surface)',
                cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <m.icon size={20} color={method === m.value ? 'var(--primary)' : 'var(--text-tertiary)'} />
              <span style={{ fontWeight: 500 }}>{m.label}</span>
              <div style={{
                marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%',
                border: `2px solid ${method === m.value ? 'var(--primary)' : 'var(--border-color)'}`,
                background: method === m.value ? 'var(--primary)' : 'transparent'
              }}></div>
            </div>
          ))}
        </div>

        <button onClick={handlePayment} className="btn btn-primary btn-lg" disabled={processing || !method} style={{ width: '100%' }}>
          {processing ? (
            <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Processing...</>
          ) : (
            <>Pay {formatCurrency(premium)}</>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: 'var(--spacing-md)' }}>
          🔒 This is a simulated payment. No real money will be charged.
        </p>
      </div>
    </div>
  );
};

export default Payment;
