// src/validators/leadCampaign.validator.js

/**
 * Validador para asignar lead a campaña
 */
export const validateCreateLeadCampaign = (req, res, next) => {
  const { lead_id, campaign_id } = req.body;
  const errors = [];

  if (!lead_id) {
    errors.push('lead_id is required');
  }

  if (!campaign_id) {
    errors.push('campaign_id is required');
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
 * Validador para actualizar asignación
 */
export const validateUpdateLeadCampaign = (req, res, next) => {
  const { status_id, assigned_agent, attempts, next_call_at } = req.body;
  const errors = [];

  if (attempts !== undefined && (typeof attempts !== 'number' || attempts < 0)) {
    errors.push('attempts must be a positive number');
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
 * Validador para cambiar estado
 */
export const validateChangeStatus = (req, res, next) => {
  const { status_id, notes } = req.body;
  const errors = [];

  if (!status_id) {
    errors.push('status_id is required');
  }

  if (notes && typeof notes !== 'string') {
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

/**
 * Validador para asignar agente
 */
export const validateAssignAgent = (req, res, next) => {
  const { assigned_agent } = req.body;
  const errors = [];

  if (!assigned_agent) {
    errors.push('assigned_agent is required');
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