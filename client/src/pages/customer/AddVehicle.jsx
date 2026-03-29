import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuCar, LuArrowLeft } from 'react-icons/lu';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vehicle_type: '', make_id: '', model_id: '', fuel_type: '',
    registration_number: '', year_of_manufacture: '', engine_number: '', chassis_number: '', color: ''
  });

  useEffect(() => {
    if (form.vehicle_type) {
      api.get(`/vehicles/makes?type=${form.vehicle_type}`).then(res => setMakes(res.data));
      setForm(prev => ({ ...prev, make_id: '', model_id: '' }));
      setModels([]);
    }
  }, [form.vehicle_type]);

  useEffect(() => {
    if (form.make_id) {
      api.get(`/vehicles/models/${form.make_id}`).then(res => setModels(res.data));
      setForm(prev => ({ ...prev, model_id: '' }));
    }
  }, [form.make_id]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vehicle_type || !form.make_id || !form.model_id || !form.fuel_type || !form.registration_number || !form.year_of_manufacture) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/vehicles', form);
      toast.success('Vehicle added successfully!');
      navigate('/customer/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <LuArrowLeft size={16} /> Back
        </button>
        <h1>Add Vehicle</h1>
        <p>Register a new vehicle to your account</p>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Vehicle Type *</label>
            <select value={form.vehicle_type} onChange={e => update('vehicle_type', e.target.value)}>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck / Commercial</option>
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Make *</label>
              <select value={form.make_id} onChange={e => update('make_id', e.target.value)} disabled={!form.vehicle_type}>
                <option value="">Select Make</option>
                {makes.map(m => <option key={m.make_id} value={m.make_id}>{m.make_name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Model *</label>
              <select value={form.model_id} onChange={e => update('model_id', e.target.value)} disabled={!form.make_id}>
                <option value="">Select Model</option>
                {models.map(m => <option key={m.model_id} value={m.model_id}>{m.model_name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Fuel Type *</label>
              <select value={form.fuel_type} onChange={e => update('fuel_type', e.target.value)}>
                <option value="">Select Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="input-group">
              <label>Year of Manufacture *</label>
              <select value={form.year_of_manufacture} onChange={e => update('year_of_manufacture', e.target.value)}>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Registration Number *</label>
            <input type="text" placeholder="MH 01 AB 1234" value={form.registration_number} onChange={e => update('registration_number', e.target.value.toUpperCase())} />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Engine Number</label>
              <input type="text" placeholder="Optional" value={form.engine_number} onChange={e => update('engine_number', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Chassis Number</label>
              <input type="text" placeholder="Optional" value={form.chassis_number} onChange={e => update('chassis_number', e.target.value)} />
            </div>
          </div>

          <div className="input-group" style={{ maxWidth: 200 }}>
            <label>Color</label>
            <input type="text" placeholder="e.g. White" value={form.color} onChange={e => update('color', e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 'var(--spacing-md)' }}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : <><LuCar size={18} /> Add Vehicle</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
