import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuClipboardList, LuArrowLeft } from 'react-icons/lu';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const FileClaim = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    policy_id: '', claim_type: '', description: '', incident_date: '', incident_location: '', estimated_amount: ''
  });

  useEffect(() => { 
    api.get('/policies')
      .then(res => setPolicies(res.data.filter(p => p.status === 'Active')))
      .catch(err => console.error(err));
  }, []);

  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 20) {
      toast.error('You can only upload up to 20 images maximum.');
      e.target.value = null; // Clear input
      setImages([]);
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.policy_id || !form.claim_type || !form.description || !form.incident_date) {
      toast.error('Please fill in all required fields'); 
      return;
    }
    setLoading(true);
    let claimId = null;

    try {
      // 1. Submit basic claim data
      const res = await api.post('/claims', form);
      claimId = res.data.claim_id;
      const claimNumber = res.data.claim_number;

      // 2. If claim submitted, handle images payload sequentially
      if (images.length > 0) {
        toast.loading(`Uploading ${images.length} photos...`, { id: 'upload-toast' });
        
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        formData.append('image_type', 'Damage Photo');

        await api.post(`/claims/${claimId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.dismiss('upload-toast');
      }

      toast.success(`Claim ${claimNumber} submitted! Your agent has been notified.`);
      navigate('/customer/claims');
    } catch (err) { 
      toast.dismiss('upload-toast');
      toast.error(err.response?.data?.message || 'Failed to file claim or upload images'); 
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
        <h1>File a Claim</h1>
        <p>Submit a new insurance claim with damage proof</p>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Select Policy *</label>
            <select value={form.policy_id} onChange={e => update('policy_id', e.target.value)}>
              <option value="">Choose an active policy</option>
              {policies.map(p => (
                <option key={p.policy_id} value={p.policy_id}>
                  {p.policy_number} — {p.make_name} {p.model_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>Claim Type *</label>
              <select value={form.claim_type} onChange={e => update('claim_type', e.target.value)}>
                <option value="">Select Type</option>
                <option value="Accident">Accident</option>
                <option value="Theft">Theft</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Fire">Fire</option>
                <option value="Third Party">Third Party</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Incident Date *</label>
              <input type="date" value={form.incident_date} onChange={e => update('incident_date', e.target.value)} max={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className="input-group">
            <label>Incident Location</label>
            <input type="text" placeholder="Where did the incident occur?" value={form.incident_location} onChange={e => update('incident_location', e.target.value)} />
          </div>

          <div className="input-group">
            <label>Description *</label>
            <textarea placeholder="Describe the damages or details in full..." value={form.description} onChange={e => update('description', e.target.value)} rows={4}></textarea>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Estimated Damage Amount (₹)</label>
              <input type="number" placeholder="e.g. 50000" min="0" value={form.estimated_amount} onChange={e => update('estimated_amount', e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Damage Photos (Max 20)</label>
              <input 
                type="file" 
                multiple 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                onChange={handleImageChange} 
                style={{ padding: '8px' }}
              />
              {images.length > 0 && (
                <small style={{ color: 'var(--primary-color)', marginTop: '4px', display: 'block' }}>
                  {images.length} file(s) selected
                </small>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 'var(--spacing-md)' }}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : <><LuClipboardList size={18} /> Submit Claim</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileClaim;
