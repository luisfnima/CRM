// src/validators/sales.validator.js

/**
 * Validador para crear venta
 */
export const validateCreateSale = (req, res, next) => {
  const { lead_campaign_id, product_id, amount, sale_date } = req.body;
  const errors = [];

  if (!lead_campaign_id) {
    errors.push('lead_campaign_id is required');
  }

  if (!product_id) {
    errors.push('product_id is required');
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('amount must be a positive number');
  }

  if (!sale_date) {
    errors.push('sale_date is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};

/**
 * Validador para actualizar venta
 */
export const validateUpdateSale = (req, res, next) => {
  const { status, amount, notes } = req.body;
  const errors = [];

  if (status && !['pending', 'installed', 'cancelled'].includes(status)) {
    errors.push('status must be one of: pending, installed, cancelled');
  }

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    errors.push('amount must be a positive number');
  }

  if (notes !== undefined && typeof notes !== 'string') {
    errors.push('notes must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};