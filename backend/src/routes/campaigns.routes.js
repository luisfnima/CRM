// src/routes/campaigns.routes.js
import { Router } from 'express';
import {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignUsers,
  assignUserToCampaign,
  removeUserFromCampaign,
  getCampaignStatuses,
  createCampaignStatus,
  getCampaignFields,
  createCampaignField,
} from '../controllers/campaigns.controller.js';
import {
  validateCreateCampaign,
  validateUpdateCampaign,
  validateAssignUser,
  validateCreateStatus,
  validateCreateField,
} from '../validators/campaigns.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/campaigns
 * Listar todas las campañas
 */
router.get('/', getAllCampaigns);

/**
 * GET /api/campaigns/:id
 * Obtener una campaña específica
 */
router.get('/:id', getCampaignById);

/**
 * POST /api/campaigns
 * Crear nueva campaña (requiere admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, validateCreateCampaign, createCampaign);

/**
 * PUT /api/campaigns/:id
 * Actualizar campaña (requiere admin/supervisor)
 */
router.put('/:id', requireAdminOrSupervisor, validateUpdateCampaign, updateCampaign);

/**
 * DELETE /api/campaigns/:id
 * Eliminar campaña (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteCampaign);

/**
 * GET /api/campaigns/:id/users
 * Obtener usuarios asignados a la campaña
 */
router.get('/:id/users', getCampaignUsers);

/**
 * POST /api/campaigns/:id/users
 * Asignar usuario a campaña (requiere admin/supervisor)
 */
router.post('/:id/users', requireAdminOrSupervisor, validateAssignUser, assignUserToCampaign);

/**
 * DELETE /api/campaigns/:id/users/:userId
 * Quitar usuario de campaña (requiere admin/supervisor)
 */
router.delete('/:id/users/:userId', requireAdminOrSupervisor, removeUserFromCampaign);

/**
 * GET /api/campaigns/:id/statuses
 * Obtener estados de la campaña
 */
router.get('/:id/statuses', getCampaignStatuses);

/**
 * POST /api/campaigns/:id/statuses
 * Crear estado en la campaña (requiere admin/supervisor)
 */
router.post('/:id/statuses', requireAdminOrSupervisor, validateCreateStatus, createCampaignStatus);

/**
 * GET /api/campaigns/:id/fields
 * Obtener campos personalizados de la campaña
 */
router.get('/:id/fields', getCampaignFields);

/**
 * POST /api/campaigns/:id/fields
 * Crear campo personalizado (requiere admin/supervisor)
 */
router.post('/:id/fields', requireAdminOrSupervisor, validateCreateField, createCampaignField);

export default router;