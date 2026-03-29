const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className="card-grid">
        {items.map(i => (
          <div key={i} className="skeleton skeleton-card" style={{ height: 200 }}></div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="stats-cards">
        {items.map(i => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }}></div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-md)' }}></div>
        {items.map(i => (
          <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }}></div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div>
        {items.map(i => (
          <div key={i} className="skeleton skeleton-text" style={{ width: `${80 - i * 15}%` }}></div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="skeleton skeleton-avatar"></div>
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text md"></div>
          <div className="skeleton skeleton-text sm"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
