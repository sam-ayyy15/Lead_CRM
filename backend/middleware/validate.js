// middleware/validate.js — Input validation rules using express-validator
const { body, validationResult } = require('express-validator');

// Validation rules for creating or updating a lead
const leadValidationRules = () => [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),

  body('company')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Converted', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Qualified, Converted, Lost'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];

// Middleware to check validation results and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Return all validation errors as an array
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = { leadValidationRules, validate };
