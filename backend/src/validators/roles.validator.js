// src/validators/roles.validator.js
// CREAR ESTE ARCHIVO NUEVO

/**
 * Validador para crear rol
 */
export const validateCreateRole = (req, res, next) => {
  const { name, role_type } = req.body;
  const errors = [];

  // Validar nombre
  if (!name || name.trim() === '') {
    errors.push('name is required');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  // Validar role_type (REQUERIDO)
  if (!role_type || role_type.trim() === '') {
    errors.push('role_type is required');
  }

  const validRoleTypes = ['admin', 'supervisor', 'backoffice', 'agent'];
  if (role_type && !validRoleTypes.includes(role_type)) {
    errors.push('role_type must be one of: admin, supervisor, backoffice, agent');
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
 * Validador para actualizar rol
 */
export const validateUpdateRole = (req, res, next) => {
  const { name, role_type, active } = req.body;
  const errors = [];

  // Validar nombre (si se envía)
  if (name !== undefined && name.trim() === '') {
    errors.push('name cannot be empty');
  }

  if (name && name.length > 100) {
    errors.push('name must be less than 100 characters');
  }

  // Validar role_type (si se envía)
  const validRoleTypes = ['admin', 'supervisor', 'backoffice', 'agent'];
  if (role_type !== undefined && !validRoleTypes.includes(role_type)) {
    errors.push('role_type must be one of: admin, supervisor, backoffice, agent');
  }

  // Validar active (si se envía)
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