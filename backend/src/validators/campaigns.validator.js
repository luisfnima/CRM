// src/validators/campaigns.validator.js

/**
 * Validador para crear campaña
 */
export const validateCreateCampaign = (req, res, next) => {
  const { name, start_date } = req.body;
  const errors = [];

  // Validaciones
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!start_date) {
    errors.push('Start date is required');
  }

  if (name && name.length > 200) {
    errors.push('Name must be less than 200 characters');
  }

  // Si hay errores, retornar
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
 * Validador para actualizar campaña
 */
export const validateUpdateCampaign = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (name && name.trim() === '') {
    errors.push('Name cannot be empty');
  }

  if (name && name.length > 200) {
    errors.push('Name must be less than 200 characters');
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
 * Validador para asignar usuario a campaña
 */
export const validateAssignUser = (req, res, next) => {
  const { userId, campaignRole } = req.body;
  const errors = [];

  if (!userId) {
    errors.push('User ID is required');
  }

  if (!campaignRole) {
    errors.push('Campaign role is required');
  }

  const allowedRoles = ['supervisor', 'agent', 'backoffice'];
  if (campaignRole && !allowedRoles.includes(campaignRole)) {
    errors.push(`Campaign role must be one of: ${allowedRoles.join(', ')}`);
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
 * Validador para crear estado
 */
export const validateCreateStatus = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Status name is required');
  }

  if (name && name.length > 100) {
    errors.push('Status name must be less than 100 characters');
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
 * Validador para crear campo personalizado
 */
export const validateCreateField = (req, res, next) => {
  const { name, label, field_type } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Field name is required');
  }

  if (!label || label.trim() === '') {
    errors.push('Field label is required');
  }

  if (!field_type) {
    errors.push('Field type is required');
  }

  const allowedTypes = [
    'text',
    'textarea',
    'number',
    'email',
    'phone',
    'select',
    'multiselect',
    'checkbox',
    'radio',
    'date',
    'datetime',
    'file',
  ];

  if (field_type && !allowedTypes.includes(field_type)) {
    errors.push(`Field type must be one of: ${allowedTypes.join(', ')}`);
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