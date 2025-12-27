// src/validators/calls.validator.js

/**
 * Validador para registrar una llamada
 */
export const validateCreateCall = (req, res, next) => {
  const { lead_campaign_id, phone_number, call_type, duration, started_at } = req.body;
  const errors = [];

  if (!lead_campaign_id) {
    errors.push('lead_campaign_id is required');
  }

  if (!phone_number || phone_number.trim() === '') {
    errors.push('phone_number is required');
  }

  if (phone_number && phone_number.length > 20) {
    errors.push('phone_number must be less than 20 characters');
  }

  if (call_type && !['outbound', 'inbound'].includes(call_type)) {
    errors.push('call_type must be one of: outbound, inbound');
  }

  if (duration !== undefined && (typeof duration !== 'number' || duration < 0)) {
    errors.push('duration must be a positive number');
  }

  if (!started_at) {
    errors.push('started_at is required');
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
 * Validador para actualizar una llamada
 */
export const validateUpdateCall = (req, res, next) => {
  const { duration, call_result_id, notes, ended_at } = req.body;
  const errors = [];

  if (duration !== undefined && (typeof duration !== 'number' || duration < 0)) {
    errors.push('duration must be a positive number');
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