const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateDestination = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('country')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Country must be between 1 and 100 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('visited')
    .optional()
    .isBoolean()
    .withMessage('Visited must be a boolean value'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('region')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Region must be less than 50 characters'),
  handleValidationErrors
];

const validateId = [
  param('id')
    .isUUID()
    .withMessage('Invalid destination ID format'),
  handleValidationErrors
];

module.exports = {
  validateDestination,
  validateId,
  handleValidationErrors
};
