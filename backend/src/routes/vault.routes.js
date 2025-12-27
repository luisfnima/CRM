// src/routes/vault.routes.js
import { Router } from 'express';
import {
  unlockVault,
  lockVault,
  viewPassword,
  getVaultStatus,
} from '../controllers/vault.controller.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /api/vault/unlock
 * Desbloquea el vault por 5 minutos
 */
router.post('/unlock', authenticate, requireAdminOrSupervisor, unlockVault);

/**
 * POST /api/vault/lock
 * Bloquea el vault manualmente
 */
router.post('/lock', authenticate, requireAdminOrSupervisor, lockVault);

/**
 * GET /api/vault/status
 * Verifica si el vault está desbloqueado
 */
router.get('/status', authenticate, requireAdminOrSupervisor, getVaultStatus);

/**
 * GET /api/vault/view/:userId
 * Ver la password de un usuario (requiere vault desbloqueado)
 */
router.get('/view/:userId', authenticate, requireAdminOrSupervisor, viewPassword);

export default router;