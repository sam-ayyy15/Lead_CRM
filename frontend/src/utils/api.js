// utils/api.js — Axios instance and API helper functions
import axios from 'axios';

// Base URL reads from .env — set REACT_APP_API_URL in production
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10-second timeout
});

// ─── Lead API Functions ───────────────────────

/**
 * Fetch all leads with optional filters and pagination
 * @param {Object} params - { status, page, limit, sortBy, sortOrder }
 */
export const getLeads = (params = {}) =>
  api.get('/leads', { params });

/**
 * Search leads by keyword across name, email, company
 * @param {string} query - search keyword
 * @param {Object} params - { status, page, limit }
 */
export const searchLeads = (query, params = {}) =>
  api.get('/leads/search', { params: { q: query, ...params } });

/**
 * Create a new lead
 * @param {Object} leadData - { name, email, phone, company, status, notes }
 */
export const createLead = (leadData) =>
  api.post('/leads', leadData);

/**
 * Update an existing lead by ID
 * @param {string} id - lead's MongoDB ObjectId
 * @param {Object} leadData - fields to update
 */
export const updateLead = (id, leadData) =>
  api.put(`/leads/${id}`, leadData);

/**
 * Delete a lead by ID
 * @param {string} id - lead's MongoDB ObjectId
 */
export const deleteLead = (id) =>
  api.delete(`/leads/${id}`);

export default api;
