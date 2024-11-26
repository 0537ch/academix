const { body, validationResult } = require('express-validator');
const xss = require('xss');

// Sanitize and validate student input
const validateStudent = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
        .customSanitizer(value => xss(value)),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
        .customSanitizer(value => xss(value)),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('studentId')
        .trim()
        .notEmpty().withMessage('Student ID is required')
        .isAlphanumeric().withMessage('Student ID must contain only letters and numbers')
        .customSanitizer(value => xss(value)),

    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),

    body('dateOfBirth')
        .optional()
        .isISO8601().withMessage('Invalid date format')
        .toDate(),

    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender value'),

    // Validate nested address object if present
    body('address.street').optional().trim().customSanitizer(value => xss(value)),
    body('address.city').optional().trim().customSanitizer(value => xss(value)),
    body('address.state').optional().trim().customSanitizer(value => xss(value)),
    body('address.zipCode').optional().trim().customSanitizer(value => xss(value)),
    body('address.country').optional().trim().customSanitizer(value => xss(value)),

    body('phoneNumber')
        .optional()
        .trim()
        .matches(/^\+?[\d\s-]+$/).withMessage('Invalid phone number format')
];

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 'error',
            errors: errors.array() 
        });
    }
    next();
};

module.exports = {
    validateStudent,
    validate
};
