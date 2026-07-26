export const formatDate = (date) => new Date(date).toDateString();

export const formatShortDate = (date) => new Date(date).toLocaleDateString();

export const formatCurrency = (amount) => `₹${Number(amount).toLocaleString()}`;

export const CATEGORY_EMOJI = {
  Concert: '🎵',
  Conference: '💼',
  Sports: '⚽',
  Workshop: '🔧',
  Seminar: '📚',
  Other: '🎪',
};

export const categoryEmoji = (category) => CATEGORY_EMOJI[category] || '🎪';

export const STATUS_COLOR = {
  booked: 'primary',
  'checked-in': 'success',
  cancelled: 'danger',
  pending: 'warning',
  confirmed: 'success',
};

export const statusColor = (status) => STATUS_COLOR[status] || 'secondary';
