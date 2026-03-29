import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuShield, LuCircleCheck, LuX, LuShieldCheck, LuStar, LuCrown, LuArrowRight } from 'react-icons/lu';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import '../Dashboard.css';

const tierIcons = { Basic: LuShield, Standard: LuShieldCheck, Premium: LuStar, Ultimate: LuCrown };
const tierColors = { Basic: '#7A7FA0', Standard: '#00D4AA', Premium: '#6C63FF', Ultimate: '#FFB020' };

const BrowsePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/plans/compare').then(res => setPlans(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const selectPlan = (plan) => {
    sessionStorage.setItem('gv_selected_plan', JSON.stringify(plan));
    navigate('/customer/select-agent');
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Choose Your Coverage</h1>
        <p>Compare our plans and find the perfect protection for your vehicle</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', alignItems: 'start' }}>
        {plans.map((plan, i) => {
          const Icon = tierIcons[plan.tier] || LuShield;
          const color = tierColors[plan.tier] || '#6C63FF';
          const isPremium = plan.tier === 'Premium';

          return (
            <motion.div
              key={plan.plan_id}
              className={`plan-card ${isPremium ? 'plan-popular' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ position: 'relative' }}
            >
              {isPremium && <div className="plan-popular-badge">Recommended</div>}
              <div className="plan-header">
                <div className="plan-icon" style={{ color, background: `${color}15` }}>
                  <Icon size={28} />
                </div>
                <span className="plan-tier">{plan.tier}</span>
                <h3 className="plan-name">{plan.plan_name}</h3>
                <div className="plan-price">
                  <span className="plan-price-amount">{formatCurrency(plan.base_price)}</span>
                  <span className="plan-price-period">/year</span>
                </div>
              </div>

              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', lineHeight: 'var(--lh-relaxed)' }}>
                {plan.description}
              </p>

              <div className="plan-features">
                {plan.features?.map(f => (
                  <div key={f.feature_id} className={`plan-feature ${f.is_included ? 'included' : 'excluded'}`}>
                    {f.is_included ? <LuCircleCheck size={16} /> : <LuX size={16} />}
                    <span>
                      {f.feature_name}
                      {f.is_included && f.coverage_limit && ` (${isNaN(Number(f.coverage_limit)) ? f.coverage_limit : formatCurrency(f.coverage_limit)})`}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => selectPlan(plan)} className={`btn ${isPremium ? 'btn-primary' : 'btn-secondary'} plan-btn`}>
                Select Plan <LuArrowRight size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowsePlans;
