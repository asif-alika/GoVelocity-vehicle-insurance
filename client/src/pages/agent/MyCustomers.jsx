import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuUsers, LuSearch } from 'react-icons/lu';
import api from '../../services/api';
import '../Dashboard.css';

const MyCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/agents/customers').then(res => setCustomers(res.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>My Customers</h1><p>All customers linked to your policies</p></div>

      <div style={{ marginBottom: 'var(--spacing-xl)', maxWidth: 400, position: 'relative' }}>
        <LuSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><LuUsers size={60} /><h3>No Customers Found</h3><p>{search ? 'Try a different search term.' : 'Customers will appear when they purchase a policy through you.'}</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>City</th><th>Policies</th><th>Claims</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.customer_id}>
                  <td><strong>{c.first_name} {c.last_name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.city}, {c.state}</td>
                  <td>{c.total_policies}</td>
                  <td>{c.total_claims}</td>
                  <td><Link to={`/agent/customers/${c.customer_id}`} className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCustomers;
