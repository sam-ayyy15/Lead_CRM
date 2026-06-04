// models/Lead.js — Mongoose schema for a Lead/Customer record
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    // Full name of the lead/contact person
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Contact email (unique per lead)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },

    // Phone number (optional)
    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // Company the lead belongs to
    company: {
      type: String,
      trim: true,
      default: '',
    },

    // Current status in the sales pipeline
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },

    // Free-text notes about the lead
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Index for faster text search on name, email, and company
LeadSchema.index({ name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Lead', LeadSchema);
