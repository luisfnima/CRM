// src/validators/statuses.validator.js

/**
 * Validador para crear status
 */
export const validateCreateStatus = (req, res, next) => {
  const { campaign_id, name, status_tab_id, color, is_final, is_global } = req.body;
  const errors = [];

  // Validar campaign_id
  if (!campaign_id) {
    errors.push('campaign_id is required');
  }

  // Validar nombre
  if (!name || name.trim() === '') {
    errors.push('name is required');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  // Validar color (formato hex)
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (color && !hexColorRegex.test(color)) {
    errors.push('color must be a valid hex color (e.g., #3b82f6)');
  }

  // Validar booleanos
  if (is_final !== undefined && typeof is_final !== 'boolean') {
    errors.push('is_final must be a boolean');
  }

  if (is_global !== undefined && typeof is_global !== 'boolean') {
    errors.push('is_global must be a boolean');
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
 * Validador para actualizar status
 */
export const validateUpdateStatus = (req, res, next) => {
  const { name, status_tab_id, color, is_final, is_global, display_order } = req.body;
  const errors = [];

  // Validar nombre (si se envía)
  if (name !== undefined && name.trim() === '') {
    errors.push('name cannot be empty');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  // Validar color (si se envía)
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (color !== undefined && color && !hexColorRegex.test(color)) {
    errors.push('color must be a valid hex color (e.g., #3b82f6)');
  }

  // Validar booleanos (si se envían)
  if (is_final !== undefined && typeof is_final !== 'boolean') {
    errors.push('is_final must be a boolean');
  }

  if (is_global !== undefined && typeof is_global !== 'boolean') {
    errors.push('is_global must be a boolean');
  }

  // Validar display_order (si se envía)
  if (display_order !== undefined && typeof display_order !== 'number') {
    errors.push('display_order must be a number');
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