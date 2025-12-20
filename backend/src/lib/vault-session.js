// src/lib/vault-session.js
import { prisma } from './prisma.js';

const VAULT_SESSION_TIMEOUT = parseInt(
  process.env.VAULT_SESSION_TIMEOUT || '300',
  10
); // 5 minutos por defecto

/**
 * Crea una sesión de vault desbloqueado
 * @param {number} adminId - ID del admin que desbloquea
 * @returns {Promise<object>} Sesión creada
 */
export async function createVaultSession(adminId) {
  // Expirar sesiones antiguas del mismo admin
  await prisma.vault_sessions.updateMany({
    where: {
      admin_id: adminId,
      is_active: true,
    },
    data: {
      is_active: false,
      locked_at: new Date(),
    },
  });

  // Crear nueva sesión
  const expiresAt = new Date(Date.now() + VAULT_SESSION_TIMEOUT * 1000);

  return prisma.vault_sessions.create({
    data: {
      admin_id: adminId,
      expires_at: expiresAt,
      is_active: true,
    },
  });
}

/**
 * Verifica si un admin tiene una sesión activa
 * @param {number} adminId - ID del admin
 * @returns {Promise<boolean>} true si tiene sesión activa
 */
export async function hasActiveVaultSession(adminId) {
  const session = await prisma.vault_sessions.findFirst({
    where: {
      admin_id: adminId,
      is_active: true,
      expires_at: {
        gt: new Date(),
      },
    },
  });

  return !!session;
}

/**
 * Bloquea la sesión activa de un admin
 * @param {number} adminId - ID del admin
 */
export async function lockVaultSession(adminId) {
  await prisma.vault_sessions.updateMany({
    where: {
      admin_id: adminId,
      is_active: true,
    },
    data: {
      is_active: false,
      locked_at: new Date(),
    },
  });
}

/**
 * Expira todas las sesiones vencidas (ejecutar periódicamente)
 */
export async function expireOldVaultSessions() {
  await prisma.vault_sessions.updateMany({
    where: {
      is_active: true,
      expires_at: {
        lt: new Date(),
      },
    },
    data: {
      is_active: false,
      locked_at: new Date(),
    },
  });
}

/**
 * Obtiene información de la sesión activa
 * @param {number} adminId - ID del admin
 * @returns {Promise<object|null>} Sesión o null
 */
export async function getActiveVaultSession(adminId) {
  return prisma.vault_sessions.findFirst({
    where: {
      admin_id: adminId,
      is_active: true,
      expires_at: {
        gt: new Date(),
      },
    },
  });
}