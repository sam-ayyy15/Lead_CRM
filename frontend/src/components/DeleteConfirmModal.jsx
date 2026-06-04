// components/DeleteConfirmModal.jsx — Confirmation dialog before deleting a lead
import React from 'react';

const DeleteConfirmModal = ({ lead, onConfirm, onCancel, loading }) => {
  if (!lead) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
      padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px',
        padding: '32px 28px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Warning icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#FFF1F2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px',
        }}>
          🗑️
        </div>

        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
          Delete Lead?
        </h3>

        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>
          You're about to permanently delete <strong style={{ color: '#0F172A' }}>{lead.name}</strong>
          {lead.company && <> from <strong style={{ color: '#0F172A' }}>{lead.company}</strong></>}.
          This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '10px 16px', border: '1px solid #E2E8F0', borderRadius: '8px',
            background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            color: '#475569',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: '10px 16px', border: 'none', borderRadius: '8px',
            background: loading ? '#FCA5A5' : '#EF4444', color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
          }}>
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
