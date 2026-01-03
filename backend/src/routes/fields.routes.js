// src/routes/fields.routes.js
import { Router } from 'express';
import {
  getFieldsByCampaign,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from '../controllers/fields.controller.js';
import {
  validateCreateField,
  validateUpdateField,
} from '../validators/fields.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/fields/campaign/:campaignId
 * Obtener todos los campos de una campaña
 */
router.get('/campaign/:campaignId', getFieldsByCampaign);

/**
 * GET /api/fields/:id
 * Obtener un campo específico
 */
router.get('/:id', getFieldById);

/**
 * POST /api/fields
 * Crear nuevo campo (requiere admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, validateCreateField, createField);

/**
 * PUT /api/fields/:id
 * Actualizar campo (requiere admin/supervisor)
 */
router.put('/:id', requireAdminOrSupervisor, validateUpdateField, updateField);

/**
 * DELETE /api/fields/:id
 * Eliminar campo (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteField);

export default router;