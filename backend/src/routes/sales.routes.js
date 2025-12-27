// src/routes/sales.routes.js
import { Router } from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from '../controllers/sales.controller.js';
import {
  validateCreateSale,
  validateUpdateSale,
} from '../validators/sales.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/sales
 * Listar todas las ventas
 * Query params: campaign_id, lead_id, status, user_id, limit, offset
 */
router.get('/', getAllSales);

/**
 * GET /api/sales/:id
 * Obtener una venta específica
 */
router.get('/:id', getSaleById);

/**
 * POST /api/sales
 * Crear nueva venta
 */
router.post('/', validateCreateSale, createSale);

/**
 * PUT /api/sales/:id
 * Actualizar venta
 */
router.put('/:id', validateUpdateSale, updateSale);

/**
 * DELETE /api/sales/:id
 * Cancelar venta (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteSale);

export default router;