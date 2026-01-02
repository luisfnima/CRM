// src/validators/companies.validator.js

/**
 * Validador para actualizar empresa
 */
export const validateUpdateCompany = (req, res, next) => {
  const { name, owner, primary_color, secondary_color, logo_url, active } = req.body;
  const errors = [];

  // Validar nombre
  if (name !== undefined) {
    if (name.trim() === '') {
      errors.push('name cannot be empty');
    }
    if (name.length > 200) {
      errors.push('name must be less than 200 characters');
    }
  }

  // Validar owner
  if (owner !== undefined && owner.length > 255) {
    errors.push('owner must be less than 255 characters');
  }

  // Validar colores (formato hex)
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  
  if (primary_color !== undefined && !hexColorRegex.test(primary_color)) {
    errors.push('primary_color must be a valid hex color (e.g., #3b82f6)');
  }

  if (secondary_color !== undefined && !hexColorRegex.test(secondary_color)) {
    errors.push('secondary_color must be a valid hex color (e.g., #e2e2e2)');
  }

  // Validar logo_url
  if (logo_url !== undefined) {
    if (logo_url && logo_url.length > 500) {
      errors.push('logo_url must be less than 500 characters');
    }
  }

  // Validar active
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