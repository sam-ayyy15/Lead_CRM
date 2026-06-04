// routes/leads.js — All CRUD routes for Leads
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { leadValidationRules, validate } = require('../middleware/validate');

// ─────────────────────────────────────────────
// GET /api/leads/search?q=keyword
// Search leads by name, email, or company
// ─────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Build a regex for case-insensitive partial matching
    const searchRegex = new RegExp(q.trim(), 'i');

    const filter = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ],
    };

    // Optionally filter by status as well
    if (status && status !== 'All') {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/leads
// Get all leads with optional filtering, sorting, and pagination
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Determine sort direction
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get counts per status for dashboard stats
    const stats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = { New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 };
    stats.forEach((s) => { statsMap[s._id] = s.count; });

    res.json({
      success: true,
      data: leads,
      stats: { ...statsMap, total },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/leads
// Create a new lead
// ─────────────────────────────────────────────
router.post('/', leadValidationRules(), validate, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    // Check if a lead with this email already exists
    const existing = await Lead.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A lead with this email already exists',
      });
    }

    const lead = new Lead({ name, email, phone, company, status, notes });
    const saved = await lead.save();

    res.status(201).json({ success: true, data: saved, message: 'Lead created successfully' });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/leads/:id
// Update an existing lead by ID
// ─────────────────────────────────────────────
router.put('/:id', leadValidationRules(), validate, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    // Check if email is taken by another lead
    if (email) {
      const existing = await Lead.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id }, // exclude current lead
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A different lead with this email already exists',
        });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status, notes },
      { new: true, runValidators: true } // return updated doc + run schema validation
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid lead ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/leads/:id
// Delete a lead by ID
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted successfully', data: lead });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid lead ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
