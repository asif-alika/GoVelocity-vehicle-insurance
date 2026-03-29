import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LuShield, LuZap, LuCar, LuHeadphones, LuCircleCheck, LuArrowRight,
  LuStar, LuCrown, LuShieldCheck, LuTrendingUp, LuClock, LuLock,
  LuUsers, LuFileText, LuSparkles
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/common/AnimatedCounter';
import './Landing.css';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  const plans = [
    {
      name: 'Third Party Only',
      tier: 'Basic',
      price: '₹2,499',
      icon: LuShield,
      color: '#7A7FA0',
      features: ['Third-Party Property Damage', 'Third-Party Bodily Injury', 'Personal Accident Cover (₹15L)'],
      excluded: ['Own Damage Cover', 'Zero Depreciation', 'Roadside Assistance']
    },
    {
      name: 'Comprehensive Standard',
      tier: 'Standard',
      price: '₹5,999',
      icon: LuShieldCheck,
      color: '#00D4AA',
      features: ['Everything in Basic', 'Own Damage Cover (₹5L)', 'Roadside Assistance', 'NCB Protection'],
      excluded: ['Zero Depreciation', 'Engine Protection']
    },
    {
      name: 'Comprehensive Premium',
      tier: 'Premium',
      price: '₹11,999',
      icon: LuStar,
      color: '#6C63FF',
      popular: true,
      features: ['Everything in Standard', 'Zero Depreciation', 'Engine Protection (₹2L)', 'Enhanced PA Cover (₹25L)'],
      excluded: ['Consumables Cover', 'Return to Invoice']
    },
    {
      name: 'Ultimate Shield',
      tier: 'Ultimate',
      price: '₹19,999',
      icon: LuCrown,
      color: '#FFB020',
      features: ['Everything in Premium', 'Consumables Cover', 'Return to Invoice', '24/7 Concierge', 'Unlimited Claims'],
      excluded: []
    }
  ];

  const features = [
    { icon: LuZap, title: 'Instant Quotes', desc: 'Get your premium quote in under 60 seconds with our smart pricing engine.' },
    { icon: LuShield, title: '100% Claim Support', desc: 'Dedicated agent assigned to every policy for hassle-free claim processing.' },
    { icon: LuCar, title: 'All Vehicle Types', desc: 'Coverage for cars, bikes, and commercial vehicles from 200+ brands.' },
    { icon: LuHeadphones, title: '24/7 Support', desc: 'Round-the-clock roadside assistance and customer support when you need it.' },
    { icon: LuLock, title: 'Secure & Digital', desc: 'End-to-end digital process with bank-grade security for your documents.' },
    { icon: LuClock, title: 'Quick Settlement', desc: 'Claims processed within 7 working days with transparent status tracking.' },
  ];

  const stats = [
    { value: '50K+', label: 'Active Policies' },
    { value: '₹200Cr', label: 'Claims Settled' },
    { value: '4.8★', label: 'Customer Rating' },
    { value: '2,000+', label: 'Trusted Agents' },
  ];

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container">
          <div className="landing-nav-inner">
            <Link to="/" className="landing-logo">
              <div className="landing-logo-icon">
                <LuZap size={22} />
              </div>
              <span className="landing-logo-text">GoVelocity</span>
            </Link>

            <div className="landing-nav-links">
              <a href="#features">Features</a>
              <a href="#plans">Plans</a>
              <a href="#stats">About</a>
              {isAuthenticated ? (
                <Link to={`/${user?.role}/dashboard`} className="btn btn-primary btn-sm">
                  Dashboard <LuArrowRight size={14} />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost">Login</Link>
                  <Link to="/register/customer" className="btn btn-primary btn-sm">
                    Get Started <LuArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">
              <LuSparkles size={14} />
              <span>Trusted by 50,000+ vehicle owners across India</span>
            </div>

            <h1 className="hero-title">
              Drive <span className="text-gradient">Fearless.</span>
              <br />
              We've Got You <span className="hero-highlight">Covered.</span>
            </h1>

            <p className="hero-subtitle">
              Premium vehicle insurance with instant quotes, dedicated agents, 
              and hassle-free claims. Protect your ride in under 3 minutes.
            </p>

            <div className="hero-actions">
              <Link to="/register/customer" className="btn btn-primary btn-lg">
                Get Insured Now <LuArrowRight size={18} />
              </Link>
              <Link to="/register/agent" className="btn btn-secondary btn-lg">
                Become an Agent
              </Link>
            </div>

            <div className="hero-stats">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="hero-stat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose <span className="text-gradient">GoVelocity?</span></h2>
            <p>We make vehicle insurance simple, transparent, and actually helpful.</p>
          </motion.div>

          <motion.div 
            className="features-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                className="feature-card card"
                variants={fadeInUp}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="section plans-section" id="plans">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Choose Your <span className="text-gradient">Protection</span></h2>
            <p>From basic third-party to ultimate bumper-to-bumper coverage.</p>
          </motion.div>

          <div className="plans-grid">
            {plans.map((plan, i) => (
              <motion.div 
                key={i}
                className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="plan-popular-badge">Most Popular</div>
                )}
                <div className="plan-header">
                  <div className="plan-icon" style={{ color: plan.color, background: `${plan.color}15` }}>
                    <plan.icon size={28} />
                  </div>
                  <span className="plan-tier">{plan.tier}</span>
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="plan-price-amount">{plan.price}</span>
                    <span className="plan-price-period">/year</span>
                  </div>
                </div>

                <div className="plan-features">
                  {plan.features.map((f, j) => (
                    <div key={j} className="plan-feature included">
                      <LuCircleCheck size={16} />
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.excluded.map((f, j) => (
                    <div key={j} className="plan-feature excluded">
                      <LuCircleCheck size={16} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/register/customer" 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} plan-btn`}
                >
                  Get Started <LuArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="section stats-section" id="stats">
        <div className="container">
          <motion.div 
            className="stats-banner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="stats-banner-bg"></div>
            <div className="stats-banner-content">
              <h2>Protecting India's Drivers Since 2020</h2>
              <p>Join thousands of satisfied customers who trust GoVelocity for their vehicle insurance needs.</p>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value"><AnimatedCounter target={50000} suffix="+" /></span>
                  <span className="stat-label">Active Policies</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value"><AnimatedCounter prefix="₹" target={200} suffix="Cr" /></span>
                  <span className="stat-label">Claims Settled</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value"><AnimatedCounter target={4} suffix=".8★" /></span>
                  <span className="stat-label">Customer Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value"><AnimatedCounter target={2000} suffix="+" /></span>
                  <span className="stat-label">Trusted Agents</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Protect Your Ride?</h2>
            <p>Get instant quotes, compare plans, and purchase your policy in minutes.</p>
            <div className="cta-actions">
              <Link to="/register/customer" className="btn btn-primary btn-lg">
                Get Started Free <LuArrowRight size={18} />
              </Link>
              <Link to="/register/agent" className="btn btn-secondary btn-lg">
                Partner as Agent <LuUsers size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="landing-logo">
                <div className="landing-logo-icon">
                  <LuZap size={20} />
                </div>
                <span className="landing-logo-text">GoVelocity</span>
              </div>
              <p>Drive Fearless. We've Got You Covered.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Product</h4>
                <a href="#plans">Plans</a>
                <a href="#features">Features</a>
                <Link to="/register/customer">Get Started</Link>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#stats">About</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Claims</a>
                <a href="#">FAQ</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 GoVelocity Insurance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
