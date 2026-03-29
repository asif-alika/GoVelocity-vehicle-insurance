import { useState, useEffect, useRef } from 'react';
import { LuUpload, LuFileText, LuCircleCheck, LuClock } from 'react-icons/lu';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const MyDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('');
  const fileRef = useRef();

  const fetchDocs = () => api.get('/documents').then(res => setDocs(res.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !docType) { toast.error('Please select a document type and file'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', docType);
      await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded!');
      setDocType(''); fileRef.current.value = '';
      fetchDocs();
    } catch (err) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>My Documents</h1><p>Upload and manage your identity and vehicle documents</p></div>

      {/* Upload */}
      <div className="card-flat" style={{ marginBottom: 'var(--spacing-2xl)', maxWidth: 600 }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}><LuUpload size={18} /> Upload Document</h3>
        <div className="auth-form">
          <div className="input-group">
            <label>Document Type *</label>
            <select value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="Driving License">Driving License</option>
              <option value="RC Book">RC Book</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Insurance Copy">Previous Insurance Copy</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>File *</label>
            <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png,.webp" />
          </div>
          <button onClick={handleUpload} className="btn btn-primary" disabled={uploading}>
            {uploading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> : <><LuUpload size={16} /> Upload</>}
          </button>
        </div>
      </div>

      {/* List */}
      {docs.length === 0 ? (
        <div className="empty-state"><LuFileText size={60} /><h3>No Documents Yet</h3><p>Upload your documents for faster claim processing.</p></div>
      ) : (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {docs.map(d => (
            <div key={d.document_id} className="doc-card">
              <div className="doc-icon"><LuFileText size={22} /></div>
              <div className="doc-info">
                <h4>{d.document_type}</h4>
                <p>{d.document_name}</p>
                <p>{formatDate(d.uploaded_at)}</p>
              </div>
              {d.is_verified ? (
                <span className="badge badge-success"><LuCircleCheck size={12} /> Verified</span>
              ) : (
                <span className="badge badge-warning"><LuClock size={12} /> Pending</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDocuments;
