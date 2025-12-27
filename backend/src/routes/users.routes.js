// src/routes/users.routes.js
import { Router } from 'express';
import {
  getUserById,
  createUser,
  resetPassword,
  getAgents,
  getSupervisors,
  getAvailableUsers,
} from '../controllers/users.controller.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== RUTAS HELPER (ANTES de /:id) ====================

/**
 * GET /api/users/agents
 * Obtener solo agentes
 */
router.get('/agents', getAgents);

/**
 * GET /api/users/supervisors
 * Obtener solo supervisores
 */
router.get('/supervisors', getSupervisors);

/**
 * GET /api/users/available
 * Obtener usuarios activos disponibles
 * Query params: role_type (agent, supervisor, all)
 */
router.get('/available', getAvailableUsers);

// ==================== RUTAS GENERICAS ====================

/**
 * POST /api/users
 * Crear nuevo usuario (requiere permisos de admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, createUser);

/**
 * GET /api/users/:id
 * Obtener un usuario específico
 */
router.get('/:id', getUserById);

/**
 * POST /api/users/:userId/reset-password
 * Resetear password de usuario (requiere permisos de admin/supervisor)
 */
router.post('/:userId/reset-password', requireAdminOrSupervisor, resetPassword);

export default router;