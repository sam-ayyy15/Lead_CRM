// components/LeadForm.jsx — Add / Edit lead modal form
import React, { useState, useEffect } from 'react';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const EMPTY_FORM = {
  name: '', email: '', phone: '', company: '', status: 'New', notes: '',
};

const LeadForm = ({ lead, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(lead?._id);

  // Pre-fill form when editing
  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
        notes: lead.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${errors[field] ? '#FCA5A5' : '#E2E8F0'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: errors[field] ? '#FFF5F5' : '#FAFAFA',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '4px',
  };

  return (
    /* Overlay backdrop */
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '16px',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9',
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
            {isEdit ? '✏️ Edit Lead' : '➕ Add New Lead'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', color: '#94A3B8', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Name + Email row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Jane Smith" style={inputStyle('name')} />
              {errors.name && <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.name}</p>}
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="jane@company.com" style={inputStyle('email')} />
              {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.email}</p>}
            </div>
          </div>

          {/* Phone + Company row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+1 (555) 000-0000" style={inputStyle('phone')} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input name="company" value={form.company} onChange={handleChange}
                placeholder="Acme Corp" style={inputStyle('company')} />
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              style={{ ...inputStyle('status'), background: '#FAFAFA', cursor: 'pointer' }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={3} placeholder="Any additional notes about this lead..."
              style={{ ...inputStyle('notes'), resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px',
              background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#64748B',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '10px 24px', border: 'none', borderRadius: '8px',
              background: loading ? '#94A3B8' : '#4F46E5', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
            }}>
              {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
