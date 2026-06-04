// components/StatsCards.jsx — Dashboard summary stat cards
import React from 'react';

// Map each status to a color pair [background, text, border]
const STATUS_COLORS = {
  total:     { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE', label: 'Total Leads' },
  New:       { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'New' },
  Contacted: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', label: 'Contacted' },
  Qualified: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'Qualified' },
  Converted: { bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0', label: 'Converted' },
  Lost:      { bg: '#FFF1F2', text: '#9F1239', border: '#FECDD3', label: 'Lost' },
};

const StatCard = ({ colorKey, value }) => {
  const { bg, text, border, label } = STATUS_COLORS[colorKey];
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <span style={{ fontSize: '13px', color: text, fontWeight: 500, opacity: 0.8 }}>
        {label}
      </span>
      <span style={{ fontSize: '28px', fontWeight: 700, color: text, lineHeight: 1.2 }}>
        {value}
      </span>
    </div>
  );
};

const StatsCards = ({ stats }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  }}>
    <StatCard colorKey="total"     value={stats.total || 0} />
    <StatCard colorKey="New"       value={stats.New || 0} />
    <StatCard colorKey="Contacted" value={stats.Contacted || 0} />
    <StatCard colorKey="Qualified" value={stats.Qualified || 0} />
    <StatCard colorKey="Converted" value={stats.Converted || 0} />
    <StatCard colorKey="Lost"      value={stats.Lost || 0} />
  </div>
);

export default StatsCards;
