// src/validators/leads.validator.js

/**
 * Validador para crear lead manual
 */
export const validateCreateLead = (req, res, next) => {
  const { phone, name } = req.body;
  const errors = [];

  if (!phone || phone.trim() === '') {
    errors.push('Phone is required');
  }

  if (phone && phone.length > 20) {
    errors.push('Phone must be less than 20 characters');
  }

  if (name && name.length > 255) {
    errors.push('Name must be less than 255 characters');
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
 * Validador para actualizar lead
 */
export const validateUpdateLead = (req, res, next) => {
  const { phone, name, email } = req.body;
  const errors = [];

  if (phone && phone.length > 20) {
    errors.push('Phone must be less than 20 characters');
  }

  if (name && name.length > 255) {
    errors.push('Name must be less than 255 characters');
  }

  if (email && email.length > 255) {
    errors.push('Email must be less than 255 characters');
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
 * Validador para importar leads
 */
export const validateImportLeads = (req, res, next) => {
  const { name, campaignId } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('List name is required');
  }

  if (!campaignId) {
    errors.push('Campaign ID is required');
  }

  if (!req.file) {
    errors.push('File is required');
  }

  if (req.file) {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      errors.push('File must be CSV or Excel (.xlsx, .xls)');
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
 * Validador para asignar lead a campaña
 */
export const validateAssignLead = (req, res, next) => {
  const { campaignId, statusId } = req.body;
  const errors = [];

  if (!campaignId) {
    errors.push('Campaign ID is required');
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
 * Validador para agregar a blacklist
 */
export const validateAddToBlacklist = (req, res, next) => {
  const { value, reason } = req.body;
  const errors = [];

  if (!value || value.trim() === '') {
    errors.push('Phone number is required');
  }

  if (value && value.length > 15) {
    errors.push('Phone number must be less than 15 characters');
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