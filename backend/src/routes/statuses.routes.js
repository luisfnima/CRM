// src/routes/statuses.routes.js
import { Router } from 'express';
import {
  getStatusesByCampaign,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
} from '../controllers/statuses.controller.js';
import {
  validateCreateStatus,
  validateUpdateStatus,
} from '../validators/statuses.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/statuses/campaign/:campaignId
 * Obtener todos los estados de una campaña
 */
router.get('/campaign/:campaignId', getStatusesByCampaign);

/**
 * GET /api/statuses/:id
 * Obtener un estado específico
 */
router.get('/:id', getStatusById);

/**
 * POST /api/statuses
 * Crear nuevo estado (requiere admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, validateCreateStatus, createStatus);

/**
 * PUT /api/statuses/:id
 * Actualizar estado (requiere admin/supervisor)
 */
router.put('/:id', requireAdminOrSupervisor, validateUpdateStatus, updateStatus);

/**
 * DELETE /api/statuses/:id
 * Eliminar estado (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteStatus);

export default router;