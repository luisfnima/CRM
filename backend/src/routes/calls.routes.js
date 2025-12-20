// src/routes/calls.routes.js
import { Router } from 'express';
import {
  getAllCalls,
  getCallById,
  createCall,
  updateCall,
} from '../controllers/calls.controller.js';
import {
  validateCreateCall,
  validateUpdateCall,
} from '../validators/calls.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/calls
 * Listar todas las llamadas
 * Query params: campaign_id, lead_id, status, user_id, limit, offset
 */
router.get('/', getAllCalls);

/**
 * GET /api/calls/:id
 * Obtener una llamada específica
 */
router.get('/:id', getCallById);

/**
 * POST /api/calls
 * Registrar nueva llamada
 */
router.post('/', validateCreateCall, createCall);

/**
 * PUT /api/calls/:id
 * Actualizar llamada
 */
router.put('/:id', validateUpdateCall, updateCall);

export default router;