// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status color class
export const getStatusClass = (status) => {
  const map = {
    Active: 'badge-active',
    Success: 'badge-success',
    Approved: 'badge-success',
    Settled: 'badge-success',
    Pending: 'badge-warning',
    'Under Review': 'badge-warning',
    Inspection: 'badge-warning',
    Submitted: 'badge-info',
    Rejected: 'badge-rejected',
    Failed: 'badge-error',
    Expired: 'badge-neutral',
    Cancelled: 'badge-neutral',
    Lapsed: 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
};

// Truncate text
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Relative time
export const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};
