// src/routes/users.routes.js
import { Router } from 'express';
import {
  createUser,
  resetPassword,
} from '../controllers/users.controller.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * POST /api/users
 * Crear nuevo usuario (requiere permisos de admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, createUser);

/**
 * POST /api/users/:userId/reset-password
 * Resetear password de usuario (requiere permisos de admin/supervisor)
 */
router.post('/:userId/reset-password', requireAdminOrSupervisor, resetPassword);

export default router;