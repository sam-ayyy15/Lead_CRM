// hooks/useLeads.js — Custom React hook to manage leads state and API calls
import { useState, useCallback } from 'react';
import { getLeads, searchLeads, createLead, updateLead, deleteLead } from '../utils/api';

const INITIAL_PAGINATION = { total: 0, page: 1, limit: 10, totalPages: 1 };
const INITIAL_STATS = { New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0, total: 0 };

const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all leads (with optional filters)
  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeads(params);
      setLeads(res.data.data);
      setStats(res.data.stats || INITIAL_STATS);
      setPagination(res.data.pagination || INITIAL_PAGINATION);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search leads by keyword
  const search = useCallback(async (query, params = {}) => {
    if (!query.trim()) {
      return fetchLeads(params);
    }
    setLoading(true);
    setError(null);
    try {
      const res = await searchLeads(query, params);
      setLeads(res.data.data);
      setPagination(res.data.pagination || INITIAL_PAGINATION);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [fetchLeads]);

  // Add a new lead
  const addLead = useCallback(async (leadData) => {
    const res = await createLead(leadData);
    return res.data;
  }, []);

  // Edit an existing lead
  const editLead = useCallback(async (id, leadData) => {
    const res = await updateLead(id, leadData);
    return res.data;
  }, []);

  // Remove a lead by ID
  const removeLead = useCallback(async (id) => {
    const res = await deleteLead(id);
    return res.data;
  }, []);

  return {
    leads, stats, pagination, loading, error,
    fetchLeads, search, addLead, editLead, removeLead,
  };
};

export default useLeads;
