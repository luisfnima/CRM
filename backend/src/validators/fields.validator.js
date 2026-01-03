// src/validators/fields.validator.js

/**
 * Validador para crear field
 */
export const validateCreateField = (req, res, next) => {
  const { campaign_id, name, label, field_type } = req.body;
  const errors = [];

  // Validar campaign_id
  if (!campaign_id) {
    errors.push('campaign_id is required');
  }

  // Validar name
  if (!name || name.trim() === '') {
    errors.push('name is required');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  // Validar label
  if (!label || label.trim() === '') {
    errors.push('label is required');
  }

  if (label && label.length > 200) {
    errors.push('label must be less than 200 characters');
  }

  // Validar field_type
  const validFieldTypes = [
    'text', 'textarea', 'number', 'email', 'phone',
    'select', 'multiselect', 'checkbox', 'radio',
    'date', 'datetime', 'file'
  ];

  if (!field_type) {
    errors.push('field_type is required');
  } else if (!validFieldTypes.includes(field_type)) {
    errors.push(`field_type must be one of: ${validFieldTypes.join(', ')}`);
  }

  // Validar que select/multiselect/radio tengan options
  if (['select', 'multiselect', 'radio'].includes(field_type)) {
    const { options } = req.body;
    if (!options || !Array.isArray(options) || options.length === 0) {
      errors.push(`${field_type} field requires a non-empty options array`);
    }
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
 * Validador para actualizar field
 */
export const validateUpdateField = (req, res, next) => {
  const { name, label, field_type, options } = req.body;
  const errors = [];

  // Validar name (si se envía)
  if (name !== undefined && name.trim() === '') {
    errors.push('name cannot be empty');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  // Validar label (si se envía)
  if (label !== undefined && label.trim() === '') {
    errors.push('label cannot be empty');
  }

  if (label && label.length > 200) {
    errors.push('label must be less than 200 characters');
  }

  // Validar field_type (si se envía)
  const validFieldTypes = [
    'text', 'textarea', 'number', 'email', 'phone',
    'select', 'multiselect', 'checkbox', 'radio',
    'date', 'datetime', 'file'
  ];

  if (field_type && !validFieldTypes.includes(field_type)) {
    errors.push(`field_type must be one of: ${validFieldTypes.join(', ')}`);
  }

  // Validar options si se está cambiando a select/multiselect/radio
  if (field_type && ['select', 'multiselect', 'radio'].includes(field_type)) {
    if (!options || !Array.isArray(options) || options.length === 0) {
      errors.push(`${field_type} field requires a non-empty options array`);
    }
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
