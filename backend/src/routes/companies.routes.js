// src/routes/companies.routes.js
import { Router } from 'express';
import {
  getMyCompany,
  getCompanyById,
  updateCompany,
  uploadLogo,
  deleteLogo,
  getCompanyStats,
} from '../controllers/companies.controller.js';
import {
  validateUpdateCompany,
} from '../validators/companies.validator.js';
import {
  authenticate,
  requireAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/companies/me
 * Obtener información de mi empresa
 */
router.get('/me', getMyCompany);

/**
 * GET /api/companies/:id
 * Obtener información de una empresa específica
 */
router.get('/:id', getCompanyById);

/**
 * GET /api/companies/:id/stats
 * Obtener estadísticas de la empresa
 */
router.get('/:id/stats', getCompanyStats);

/**
 * PUT /api/companies/:id
 * Actualizar empresa (requiere admin)
 */
router.put('/:id', requireAdmin, validateUpdateCompany, updateCompany);

/**
 * POST /api/companies/:id/logo
 * Subir logo de la empresa (requiere admin)
 */
router.post('/:id/logo', requireAdmin, uploadLogo);

/**
 * DELETE /api/companies/:id/logo
 * Eliminar logo de la empresa (requiere admin)
 */
router.delete('/:id/logo', requireAdmin, deleteLogo);

export default router;