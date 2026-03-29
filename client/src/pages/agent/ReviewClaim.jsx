import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuCircleCheck, LuCircleX, LuClock, LuSearch, LuUser, LuCar, LuShield, LuImage } from 'react-icons/lu';
import api from '../../services/api';
import { formatDate, formatCurrency, getStatusClass } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ReviewClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState({ status: '', approved_amount: '', agent_remarks: '' });

  useEffect(() => { api.get(`/claims/${id}`).then(res => setClaim(res.data)).catch(() => {}).finally(() => setLoading(false)); }, [id]);

  const handleSubmit = async () => {
    if (!review.status) { toast.error('Please select a status'); return; }
    setSubmitting(true);
    try {
      await api.post(`/claims/${id}/review`, review);
      toast.success(`Claim ${review.status.toLowerCase()} successfully`);
      navigate('/agent/claims');
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!claim) return <div className="empty-state"><h3>Claim Not Found</h3></div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}><LuArrowLeft size={16} /> Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2xl)' }}>
        <div><h1>Review Claim</h1><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{claim.claim_number}</p></div>
        <span className={`badge ${getStatusClass(claim.status)}`}>{claim.status}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Left: Claim details */}
        <div>
          <div className="card-flat" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}><LuUser size={16} /> Customer</h3>
            <div className="summary-grid">
              <div className="summary-item"><label>Name</label><span>{claim.customer_first_name} {claim.customer_last_name}</span></div>
              <div className="summary-item"><label>Email</label><span>{claim.customer_email}</span></div>
              <div className="summary-item"><label>Phone</label><span>{claim.customer_phone}</span></div>
            </div>
          </div>

          <div className="card-flat" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}><LuCar size={16} /> Vehicle & Policy</h3>
            <div className="summary-grid">
              <div className="summary-item"><label>Vehicle</label><span>{claim.make_name} {claim.model_name}</span></div>
              <div className="summary-item"><label>Reg. No.</label><span>{claim.registration_number}</span></div>
              <div className="summary-item"><label>Policy</label><span>{claim.policy_number}</span></div>
              <div className="summary-item"><label>Plan</label><span>{claim.plan_name} ({claim.tier})</span></div>
            </div>
          </div>

          <div className="card-flat">
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}><LuShield size={16} /> Incident Details</h3>
            <div className="summary-grid">
              <div className="summary-item"><label>Type</label><span>{claim.claim_type}</span></div>
              <div className="summary-item"><label>Date</label><span>{formatDate(claim.incident_date)}</span></div>
              <div className="summary-item"><label>Location</label><span>{claim.incident_location || '—'}</span></div>
              <div className="summary-item"><label>Estimated</label><span>{claim.estimated_amount ? formatCurrency(claim.estimated_amount) : '—'}</span></div>
            </div>
            <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Description</label>
              <p style={{ fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh-relaxed)' }}>{claim.description}</p>
            </div>
          </div>

          {/* Render Damage Photos Section */}
          {claim.images && claim.images.length > 0 && (
            <div className="card-flat" style={{ marginTop: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                <LuImage size={16} /> Damage Photos ({claim.images.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--spacing-md)' }}>
                {claim.images.map((img, idx) => {
                  /* Replace backend absolute path resolving to proper http route */
                  const imgUrl = `http://localhost:5000/${img.image_path.replace(/\\/g, '/')}`;
                  
                  return (
                    <a key={img.image_id || idx} href={imgUrl} target="_blank" rel="noreferrer">
                      <img 
                        src={imgUrl} 
                        alt={`Damage ${idx + 1}`} 
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', cursor: 'zoom-in' }} 
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Review form */}
        <div className="review-form">
          <h3>Submit Review</h3>
          <div className="auth-form">
            <div className="input-group">
              <label>Update Status *</label>
              <select value={review.status} onChange={e => setReview(prev => ({ ...prev, status: e.target.value }))}>
                <option value="">Select Status</option>
                <option value="Under Review">Under Review</option>
                <option value="Inspection">Send for Inspection</option>
                <option value="Approved">Approve Claim</option>
                <option value="Rejected">Reject Claim</option>
                <option value="Settled">Settle Claim</option>
              </select>
            </div>

            {(review.status === 'Approved' || review.status === 'Settled') && (
              <div className="input-group">
                <label>Approved Amount (₹)</label>
                <input type="number" placeholder="Amount to approve" value={review.approved_amount} onChange={e => setReview(prev => ({ ...prev, approved_amount: e.target.value }))} />
              </div>
            )}

            <div className="input-group">
              <label>Remarks</label>
              <textarea placeholder="Add your review remarks..." value={review.agent_remarks} onChange={e => setReview(prev => ({ ...prev, agent_remarks: e.target.value }))} rows={4}></textarea>
            </div>

            <button onClick={handleSubmit} className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewClaim;
