// src/validators/products.validator.js

/**
 * Validador para crear categoría
 */
export const validateCreateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('name is required');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
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
 * Validador para actualizar categoría
 */
export const validateUpdateCategory = (req, res, next) => {
  const { name, description, display_order, active } = req.body;
  const errors = [];

  if (name !== undefined && name.trim() === '') {
    errors.push('name cannot be empty');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  if (display_order !== undefined && typeof display_order !== 'number') {
    errors.push('display_order must be a number');
  }

  if (active !== undefined && typeof active !== 'boolean') {
    errors.push('active must be a boolean');
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
 * Validador para crear producto
 */
export const validateCreateProduct = (req, res, next) => {
  const { name, price, commitment_months } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('name is required');
  }

  if (name && name.length > 200) {
    errors.push('name must be less than 200 characters');
  }

  if (!price || typeof price !== 'number' || price < 0) {
    errors.push('price must be a positive number');
  }

  if (!commitment_months || typeof commitment_months !== 'number' || commitment_months < 0) {
    errors.push('commitment_months must be a positive number');
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
 * Validador para actualizar producto
 */
export const validateUpdateProduct = (req, res, next) => {
  const { name, price, commitment_months, active } = req.body;
  const errors = [];

  if (name !== undefined && name.trim() === '') {
    errors.push('name cannot be empty');
  }

  if (name && name.length > 200) {
    errors.push('name must be less than 200 characters');
  }

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    errors.push('price must be a positive number');
  }

  if (commitment_months !== undefined && (typeof commitment_months !== 'number' || commitment_months < 0)) {
    errors.push('commitment_months must be a positive number');
  }

  if (active !== undefined && typeof active !== 'boolean') {
    errors.push('active must be a boolean');
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