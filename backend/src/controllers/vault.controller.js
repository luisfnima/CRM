// src/controllers/vault.controller.js
import { prisma } from '../lib/prisma.js';
import { verifyPassword, decryptPassword } from '../lib/password-vault.js';
import {
  createVaultSession,
  hasActiveVaultSession,
  lockVaultSession,
} from '../lib/vault-session.js';

/**
 * POST /api/vault/unlock
 * Desbloquea el vault verificando la password del admin
 */
export const unlockVault = async (req, res) => {
  try {
    const { password } = req.body;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'Password is required',
      });
    }

    // Obtener admin
    const admin = await prisma.users.findUnique({
      where: { id: adminId },
      include: {
        role: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        error: 'Admin not found',
      });
    }

    // Verificar password
    const isPasswordValid = await verifyPassword(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
      });
    }

    // Crear sesión del vault
    const session = await createVaultSession(adminId);

    return res.json({
      success: true,
      session: {
        id: session.id,
        expiresAt: session.expires_at,
        timeout: parseInt(process.env.VAULT_SESSION_TIMEOUT || '300', 10),
      },
    });
  } catch (error) {
    console.error('Error unlocking vault:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/vault/lock
 * Bloquea manualmente el vault del admin
 */
export const lockVault = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    await lockVaultSession(adminId);

    return res.json({
      success: true,
      message: 'Vault locked successfully',
    });
  } catch (error) {
    console.error('Error locking vault:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/vault/view/:userId
 * Obtiene la password de un usuario (requiere sesión activa)
 */
export const viewPassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    // Verificar que tiene sesión activa
    const hasSession = await hasActiveVaultSession(adminId);
    if (!hasSession) {
      return res.status(403).json({
        error: 'Vault is locked. Please unlock first.',
      });
    }

    // Obtener password del vault
    const vaultEntry = await prisma.password_vault.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!vaultEntry) {
      return res.status(404).json({
        error: 'Password not found in vault',
      });
    }

    // Desencriptar password
    const plainPassword = decryptPassword(vaultEntry.encrypted_password);

    // Registrar acceso en log
    await prisma.password_access_log.create({
      data: {
        vault_id: vaultEntry.id,
        accessed_by: adminId,
        action: 'view',
        ip_address: req.ip || req.socket.remoteAddress || 'unknown',
      },
    });

    return res.json({
      success: true,
      user: vaultEntry.user,
      password: plainPassword,
    });
  } catch (error) {
    console.error('Error viewing password:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/vault/status
 * Verifica si el vault está desbloqueado
 */
export const getVaultStatus = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    const hasSession = await hasActiveVaultSession(adminId);

    return res.json({
      success: true,
      unlocked: hasSession,
    });
  } catch (error) {
    console.error('Error checking vault status:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};