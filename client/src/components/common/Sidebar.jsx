import { NavLink, useLocation } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuCar, LuShield, LuUsers, LuFileText,
  LuClipboardList, LuCreditCard, LuUser, LuLogOut, LuStar,
  LuFolderOpen, LuSettings, LuZap
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const customerLinks = [
    { to: '/customer/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
    { to: '/customer/vehicles', icon: LuCar, label: 'My Vehicles' },
    { to: '/customer/plans', icon: LuShield, label: 'Browse Plans' },
    { to: '/customer/policies', icon: LuFileText, label: 'My Policies' },
    { to: '/customer/claims', icon: LuClipboardList, label: 'My Claims' },
    { to: '/customer/documents', icon: LuFolderOpen, label: 'My Documents' },
    { to: '/customer/profile', icon: LuUser, label: 'Profile' },
  ];

  const agentLinks = [
    { to: '/agent/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
    { to: '/agent/customers', icon: LuUsers, label: 'My Customers' },
    { to: '/agent/claims', icon: LuClipboardList, label: 'Pending Claims' },
    { to: '/agent/policies', icon: LuFileText, label: 'Managed Policies' },
    { to: '/agent/plans', icon: LuSettings, label: 'Manage Plans' },
    { to: '/agent/profile', icon: LuUser, label: 'Profile' },
  ];

  const links = role === 'customer' ? customerLinks : agentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <LuZap size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-name">GoVelocity</span>
            <span className="logo-sub">{role === 'customer' ? 'Customer Portal' : 'Agent Portal'}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-links">
          {links.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
                {link.to.includes('claims') && role === 'agent' && (
                  <span className="sidebar-badge">!</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="sidebar-user-role">{role}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Logout">
          <LuLogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
