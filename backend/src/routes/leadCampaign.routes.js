// src/routes/leadCampaign.routes.js
import { Router } from 'express';
import {
  getAllLeadCampaigns,
  getLeadCampaignById,
  createLeadCampaign,
  updateLeadCampaign,
  changeStatus,
  assignAgent,
  deleteLeadCampaign,
} from '../controllers/leadCampaign.controller.js';
import {
  validateCreateLeadCampaign,
  validateUpdateLeadCampaign,
  validateChangeStatus,
  validateAssignAgent,
} from '../validators/leadCampaign.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/lead-campaign
 * Listar asignaciones de leads a campañas
 * Query params: campaign_id, status_id, assigned_agent, limit, offset
 */
router.get('/', getAllLeadCampaigns);

/**
 * GET /api/lead-campaign/:id
 * Obtener una asignación específica con historial
 */
router.get('/:id', getLeadCampaignById);

/**
 * POST /api/lead-campaign
 * Asignar lead a campaña
 */
router.post('/', validateCreateLeadCampaign, createLeadCampaign);

/**
 * PUT /api/lead-campaign/:id
 * Actualizar asignación
 */
router.put('/:id', validateUpdateLeadCampaign, updateLeadCampaign);

/**
 * PUT /api/lead-campaign/:id/status
 * Cambiar estado del lead (crea historial automáticamente)
 */
router.put('/:id/status', validateChangeStatus, changeStatus);

/**
 * PUT /api/lead-campaign/:id/assign-agent
 * Asignar agente al lead (requiere admin/supervisor)
 */
router.put('/:id/assign-agent', requireAdminOrSupervisor, validateAssignAgent, assignAgent);

/**
 * DELETE /api/lead-campaign/:id
 * Eliminar asignación (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteLeadCampaign);

export default router;