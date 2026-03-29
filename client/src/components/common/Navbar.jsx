import { useLocation } from 'react-router-dom';
import { LuBell, LuSearch, LuMenu } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/customer/dashboard': 'Dashboard',
      '/customer/vehicles': 'My Vehicles',
      '/customer/vehicles/add': 'Add Vehicle',
      '/customer/plans': 'Browse Plans',
      '/customer/select-agent': 'Select Agent',
      '/customer/policy-summary': 'Policy Summary',
      '/customer/payment': 'Payment',
      '/customer/policies': 'My Policies',
      '/customer/claims/new': 'File a Claim',
      '/customer/claims': 'My Claims',
      '/customer/documents': 'My Documents',
      '/customer/profile': 'Profile',
      '/agent/dashboard': 'Dashboard',
      '/agent/customers': 'My Customers',
      '/agent/claims': 'Pending Claims',
      '/agent/policies': 'Managed Policies',
      '/agent/plans': 'Manage Plans',
      '/agent/profile': 'Profile',
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn">
          <LuMenu size={20} />
        </button>
        <h2 className="navbar-title">{getPageTitle()}</h2>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <LuSearch size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search-input"
          />
        </div>

        <button className="navbar-notification">
          <LuBell size={20} />
          <span className="navbar-notification-dot"></span>
        </button>

        <div className="navbar-profile">
          <div className="navbar-avatar">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
