// App.jsx — Root component for the Lead Management CRM
import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatsCards from './components/StatsCards';
import LeadsTable from './components/LeadsTable';
import LeadForm from './components/LeadForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import useLeads from './hooks/useLeads';
import './App.css';

const STATUSES = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

function App() {
  // CRM state
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null); // null = Add, lead = Edit
  const [deletingLead, setDeletingLead] = useState(null); // lead to confirm delete

  // Filter / search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Action loading states
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const { leads, stats, pagination, loading, error, fetchLeads, search, addLead, editLead, removeLead } = useLeads();

  // Debounce ref for search
  const searchTimeout = useRef(null);

  // ─── Load leads on filter/sort/page change ────
  const loadLeads = useCallback(() => {
    const params = { status: statusFilter, page, limit: 10, sortBy, sortOrder };
    if (searchQuery.trim()) {
      search(searchQuery, params);
    } else {
      fetchLeads(params);
    }
  }, [statusFilter, page, sortBy, sortOrder, searchQuery, fetchLeads, search]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // ─── Search with debounce ─────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setPage(1); // reset to first page on new search
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const params = { status: statusFilter, page: 1, limit: 10, sortBy, sortOrder };
      if (val.trim()) search(val, params);
      else fetchLeads(params);
    }, 400); // 400ms debounce
  };

  // ─── Toast helper ─────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Sort toggle ──────────────────────────────
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // ─── Add / Edit form submit ───────────────────
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingLead) {
        await editLead(editingLead._id, formData);
        showToast('Lead updated successfully');
      } else {
        await addLead(formData);
        showToast('Lead added successfully ');
      }
      setShowForm(false);
      setEditingLead(null);
      loadLeads();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      showToast(msg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Delete confirm ───────────────────────────
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await removeLead(deletingLead._id);
      showToast('Lead deleted successfully');
      setDeletingLead(null);
      loadLeads();
    } catch (err) {
      showToast('Failed to delete lead', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Open edit form ───────────────────────────
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  // ─── Open add form ────────────────────────────
  const handleAddNew = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ─── Toast Notification ─── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: toast.type === 'error' ? '#FEF2F2' : '#F0FDF4',
          border: `1px solid ${toast.type === 'error' ? '#FECACA' : '#BBF7D0'}`,
          color: toast.type === 'error' ? '#DC2626' : '#15803D',
          padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '320px',
        }}>
          {toast.message}
        </div>
      )}

      {/* ─── Header ─── */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #E2E8F0',
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>⚪</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              LeadFlow CRM
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Lead Management Dashboard</p>
          </div>
        </div>
        <button onClick={handleAddNew} style={{
          padding: '8px 18px', background: '#4F46E5', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Lead
        </button>
      </header>

      {/* ─── Main Content ─── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Table Card */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #E2E8F0', overflow: 'hidden',
        }}>
          {/* Toolbar */}
          <div style={{
            padding: '18px 20px', display: 'flex', alignItems: 'center',
            gap: '12px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap',
          }}>
            {/* Search bar */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '16px',
              }}></span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, email, or company..."
                style={{
                  width: '100%', padding: '9px 12px 9px 36px',
                  border: '1px solid #E2E8F0', borderRadius: '8px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  background: '#FAFAFA',
                }}
              />
            </div>

            {/* Status filter pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                    fontWeight: statusFilter === s ? 700 : 400,
                    border: `1px solid ${statusFilter === s ? '#4F46E5' : '#E2E8F0'}`,
                    background: statusFilter === s ? '#4F46E5' : '#fff',
                    color: statusFilter === s ? '#fff' : '#64748B',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div style={{
              padding: '16px 20px', background: '#FFF1F2',
              borderBottom: '1px solid #FECDD3', color: '#BE123C', fontSize: '14px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Table */}
          <LeadsTable
            leads={leads}
            loading={loading}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={setDeletingLead}
            onPageChange={setPage}
          />
        </div>
      </main>

      {/* ─── Add/Edit Modal ─── */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditingLead(null); }}
          loading={formLoading}
        />
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {deletingLead && (
        <DeleteConfirmModal
          lead={deletingLead}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingLead(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default App;
