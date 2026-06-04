// components/LeadsTable.jsx — Leads data table with sort, actions, pagination
import React from 'react';

// Color config for each status badge
const STATUS_BADGE = {
  New:       { bg: '#EFF6FF', color: '#1D4ED8' },
  Contacted: { bg: '#F0FDF4', color: '#15803D' },
  Qualified: { bg: '#FFFBEB', color: '#B45309' },
  Converted: { bg: '#F0FDF4', color: '#14532D' },
  Lost:      { bg: '#FFF1F2', color: '#BE123C' },
};

const StatusBadge = ({ status }) => {
  const { bg, color } = STATUS_BADGE[status] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      background: bg, color, padding: '3px 10px', borderRadius: '20px',
      fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
};

// Format ISO date to readable string
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// Truncate long text with ellipsis
const truncate = (str, len = 28) =>
  str && str.length > len ? str.slice(0, len) + '…' : (str || '—');

const LeadsTable = ({
  leads, loading, pagination, onEdit, onDelete,
  onPageChange, sortBy, sortOrder, onSort,
}) => {
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span style={{ color: '#CBD5E1' }}> ↕</span>;
    return <span style={{ color: '#4F46E5' }}>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>;
  };

  const thStyle = (field) => ({
    padding: '12px 16px', textAlign: 'left', fontSize: '12px',
    fontWeight: 700, color: '#64748B', textTransform: 'uppercase',
    letterSpacing: '0.05em', cursor: field ? 'pointer' : 'default',
    background: '#F8FAFC', userSelect: 'none', whiteSpace: 'nowrap',
  });

  const tdStyle = {
    padding: '14px 16px', fontSize: '14px', color: '#1E293B',
    borderBottom: '1px solid #F1F5F9', verticalAlign: 'middle',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
        <p style={{ margin: 0, fontSize: '15px' }}>Loading leads...</p>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>No leads found</p>
        <p style={{ margin: '4px 0 0', fontSize: '13px' }}>Try adjusting your search or filters</p>
      </div>
    );
  }

  const { page, totalPages, total } = pagination;

  return (
    <div>
      {/* Scrollable table wrapper */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={thStyle('name')} onClick={() => onSort('name')}>
                Name <SortIcon field="name" />
              </th>
              <th style={thStyle('email')} onClick={() => onSort('email')}>
                Email <SortIcon field="email" />
              </th>
              <th style={thStyle(null)}>Phone</th>
              <th style={thStyle('company')} onClick={() => onSort('company')}>
                Company <SortIcon field="company" />
              </th>
              <th style={thStyle('status')} onClick={() => onSort('status')}>
                Status <SortIcon field="status" />
              </th>
              <th style={thStyle('createdAt')} onClick={() => onSort('createdAt')}>
                Created <SortIcon field="createdAt" />
              </th>
              <th style={{ ...thStyle(null), textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}
                style={{ transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{lead.name}</div>
                  {lead.notes && (
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                      {truncate(lead.notes, 35)}
                    </div>
                  )}
                </td>
                <td style={{ ...tdStyle, color: '#4F46E5' }}>
                  <a href={`mailto:${lead.email}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}>
                    {truncate(lead.email, 30)}
                  </a>
                </td>
                <td style={tdStyle}>{lead.phone || '—'}</td>
                <td style={tdStyle}>{truncate(lead.company, 22) || '—'}</td>
                <td style={tdStyle}><StatusBadge status={lead.status} /></td>
                <td style={{ ...tdStyle, color: '#64748B', fontSize: '13px' }}>
                  {formatDate(lead.createdAt)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    {/* Edit button */}
                    <button onClick={() => onEdit(lead)} title="Edit lead"
                      style={{
                        padding: '5px 12px', border: '1px solid #E2E8F0', borderRadius: '6px',
                        background: '#fff', cursor: 'pointer', fontSize: '13px',
                        color: '#4F46E5', fontWeight: 500, transition: 'all 0.15s',
                      }}>
                      Edit
                    </button>
                    {/* Delete button */}
                    <button onClick={() => onDelete(lead)} title="Delete lead"
                      style={{
                        padding: '5px 12px', border: '1px solid #FCA5A5', borderRadius: '6px',
                        background: '#FFF5F5', cursor: 'pointer', fontSize: '13px',
                        color: '#EF4444', fontWeight: 500, transition: 'all 0.15s',
                      }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '8px',
        }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>
            Showing {(page - 1) * pagination.limit + 1}–{Math.min(page * pagination.limit, total)} of {total} leads
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
              style={{
                padding: '6px 14px', border: '1px solid #E2E8F0', borderRadius: '6px',
                background: page === 1 ? '#F8FAFC' : '#fff', color: page === 1 ? '#CBD5E1' : '#374151',
                cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px',
              }}>
              ← Prev
            </button>
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Center around current page
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;

              return (
                <button key={pageNum} onClick={() => onPageChange(pageNum)}
                  style={{
                    padding: '6px 12px', border: `1px solid ${pageNum === page ? '#4F46E5' : '#E2E8F0'}`,
                    borderRadius: '6px', background: pageNum === page ? '#4F46E5' : '#fff',
                    color: pageNum === page ? '#fff' : '#374151', cursor: 'pointer', fontSize: '13px',
                    fontWeight: pageNum === page ? 700 : 400,
                  }}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
              style={{
                padding: '6px 14px', border: '1px solid #E2E8F0', borderRadius: '6px',
                background: page === totalPages ? '#F8FAFC' : '#fff',
                color: page === totalPages ? '#CBD5E1' : '#374151',
                cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px',
              }}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
