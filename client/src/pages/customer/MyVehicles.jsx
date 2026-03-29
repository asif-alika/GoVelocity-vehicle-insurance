import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuCar, LuPlus, LuBike, LuTruck } from 'react-icons/lu';
import api from '../../services/api';
import '../Dashboard.css';

const iconMap = { Car: LuCar, Bike: LuBike, Truck: LuTruck };

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles').then(res => setVehicles(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Vehicles</h1>
          <p>Manage your registered vehicles</p>
        </div>
        <Link to="/customer/vehicles/add" className="btn btn-primary"><LuPlus size={16} /> Add Vehicle</Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="empty-state">
          <LuCar size={60} />
          <h3>No Vehicles Registered</h3>
          <p>Add your first vehicle to get started with insurance.</p>
          <Link to="/customer/vehicles/add" className="btn btn-primary"><LuPlus size={16} /> Add Vehicle</Link>
        </div>
      ) : (
        <div className="card-grid">
          {vehicles.map(v => {
            const Icon = iconMap[v.vehicle_type] || LuCar;
            return (
              <div key={v.vehicle_id} className="vehicle-card">
                <div className="vehicle-icon"><Icon size={28} /></div>
                <div className="vehicle-info">
                  <h3>{v.make_name} {v.model_name}</h3>
                  <p>{v.vehicle_type} • {v.fuel_type} • {v.year_of_manufacture}</p>
                  <span className="vehicle-reg">{v.registration_number}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
