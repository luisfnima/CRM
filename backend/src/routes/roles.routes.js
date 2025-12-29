// src/routes/roles.routes.js
// CREAR ESTE ARCHIVO NUEVO
import { Router } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roles.controller.js';
import {
  validateCreateRole,
  validateUpdateRole,
} from '../validators/roles.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/roles
 * Listar todos los roles
 * Query params: active (true/false), role_type (admin, supervisor, backoffice, agent)
 */
router.get('/', getAllRoles);

/**
 * GET /api/roles/:id
 * Obtener un rol específico
 */
router.get('/:id', getRoleById);

/**
 * POST /api/roles
 * Crear nuevo rol (requiere admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, validateCreateRole, createRole);

/**
 * PUT /api/roles/:id
 * Actualizar rol (requiere admin/supervisor)
 */
router.put('/:id', requireAdminOrSupervisor, validateUpdateRole, updateRole);

/**
 * DELETE /api/roles/:id
 * Eliminar rol (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteRole);

export default router;