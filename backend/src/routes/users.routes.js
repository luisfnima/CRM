// src/routes/users.routes.js
import { Router } from 'express';
import {
  createUser,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from '../controllers/users.controller.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/users
 * Obtener todos los usuarios
 */
router.get('/', getAllUsers);

/**
 * GET /api/users/:id
 * Obtener usuario por ID
 */
router.get('/:id', getUserById);

/**
 * POST /api/users
 * Crear nuevo usuario (requiere permisos de admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, createUser);

/**
 * PUT /api/users/:id
 * Actualizar usuario (requiere permisos de admin/supervisor)
 */
router.put('/:id', requireAdminOrSupervisor, updateUser);

/**
 * DELETE /api/users/:id
 * Eliminar usuario (requiere permisos de admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteUser);

/**
 * PATCH /api/users/:id/toggle-status
 * Cambiar estado del usuario (requiere permisos de admin/supervisor)
 */
router.patch('/:id/toggle-status', requireAdminOrSupervisor, toggleUserStatus);

/**
 * POST /api/users/:userId/reset-password
 * Resetear password de usuario (requiere permisos de admin/supervisor)
 */
router.post('/:userId/reset-password', requireAdminOrSupervisor, resetPassword);

export default router;