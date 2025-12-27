// src/controllers/users.controller.js
import { prisma } from '../lib/prisma.js';
import {
  hashPassword,
  encryptPassword,
  generateSecurePassword,
} from '../lib/password-vault.js';

/**
 * POST /api/users
 * Crea un nuevo usuario y guarda su password en el vault
 */
export const createUser = async (req, res) => {
  try {
    const {
      companyId,
      name,
      email,
      roleId,
      branchId,
      scheduleId,
      phone,
      password: providedPassword,
    } = req.body;

    const createdBy = req.user?.userId;

    // Validación
    if (!companyId || !name || !email || !createdBy) {
      return res.status(400).json({
        error: 'Company ID, name, and email are required',
      });
    }

    // Verificar que el email no exista
    const existingUser = await prisma.users.findUnique({
      where: {
        company_id_email: {
          company_id: companyId,
          email: email,
        },
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already exists',
      });
    }

    // Generar password si no se proporcionó
    const plainPassword = providedPassword || generateSecurePassword(12);

    // Hash para login
    const passwordHash = await hashPassword(plainPassword);

    // Encriptar para vault
    const encryptedPassword = encryptPassword(plainPassword);

    // Crear usuario
    const user = await prisma.users.create({
      data: {
        company_id: companyId,
        name,
        email,
        password_hash: passwordHash,
        role_id: roleId || null,
        branch_id: branchId || null,
        schedule_id: scheduleId || null,
        phone: phone || null,
        status: 'active',
      },
    });

    // Guardar en vault
    await prisma.password_vault.create({
      data: {
        user_id: user.id,
        encrypted_password: encryptedPassword,
        created_by: createdBy,
      },
    });

    // Registrar en log
    const vaultEntry = await prisma.password_vault.findUnique({
      where: { user_id: user.id },
    });

    if (vaultEntry) {
      await prisma.password_access_log.create({
        data: {
          vault_id: vaultEntry.id,
          accessed_by: createdBy,
          action: 'create',
          ip_address: req.ip || req.socket.remoteAddress || 'unknown',
        },
      });
    }

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      password: plainPassword, // Mostrar solo una vez al crear
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/users/:userId/reset-password
 * Resetea la password de un usuario y actualiza el vault
 */
export const resetPassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { newPassword } = req.body;
    const resetBy = req.user?.userId;

    // Validación
    if (!resetBy) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    // Verificar que el usuario existe
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Generar nueva password si no se proporcionó
    const plainPassword = newPassword || generateSecurePassword(12);

    // Hash para login
    const passwordHash = await hashPassword(plainPassword);

    // Encriptar para vault
    const encryptedPassword = encryptPassword(plainPassword);

    // Actualizar usuario
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: passwordHash,
        updated_at: new Date(),
      },
    });

    // Actualizar vault
    const vaultEntry = await prisma.password_vault.findUnique({
      where: { user_id: userId },
    });

    if (vaultEntry) {
      await prisma.password_vault.update({
        where: { user_id: userId },
        data: {
          encrypted_password: encryptedPassword,
          updated_at: new Date(),
        },
      });

      // Registrar en log
      await prisma.password_access_log.create({
        data: {
          vault_id: vaultEntry.id,
          accessed_by: resetBy,
          action: 'reset',
          ip_address: req.ip || req.socket.remoteAddress || 'unknown',
        },
      });
    } else {
      // Si no existe entrada en vault, crearla
      const newVaultEntry = await prisma.password_vault.create({
        data: {
          user_id: userId,
          encrypted_password: encryptedPassword,
          created_by: resetBy,
        },
      });

      await prisma.password_access_log.create({
        data: {
          vault_id: newVaultEntry.id,
          accessed_by: resetBy,
          action: 'create',
          ip_address: req.ip || req.socket.remoteAddress || 'unknown',
        },
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      password: plainPassword, // Mostrar solo una vez
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};


// ==================== HELPERS PARA USERS ====================
// Agregar estos métodos al final del archivo users.controller.js existente

/**
 * GET /api/users/agents
 * Obtener solo usuarios con rol de agente
 */
export const getAgents = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { status = 'active' } = req.query;

    // Buscar el rol "agente" o similar
    const agentRoles = await prisma.roles.findMany({
      where: {
        company_id: companyId,
        OR: [
          { name: { contains: 'agente', mode: 'insensitive' } },
          { name: { contains: 'agent', mode: 'insensitive' } },
          { name: { contains: 'asesor', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
      },
    });

    const roleIds = agentRoles.map(r => r.id);

    const agents = await prisma.users.findMany({
      where: {
        company_id: companyId,
        role_id: { in: roleIds },
        ...(status && { status }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        photo_url: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents',
    });
  }
};

/**
 * GET /api/users/supervisors
 * Obtener solo usuarios con rol de supervisor
 */
export const getSupervisors = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { status = 'active' } = req.query;

    // Buscar el rol "supervisor" o similar
    const supervisorRoles = await prisma.roles.findMany({
      where: {
        company_id: companyId,
        OR: [
          { name: { contains: 'supervisor', mode: 'insensitive' } },
          { name: { contains: 'admin', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
      },
    });

    const roleIds = supervisorRoles.map(r => r.id);

    const supervisors = await prisma.users.findMany({
      where: {
        company_id: companyId,
        role_id: { in: roleIds },
        ...(status && { status }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        photo_url: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: supervisors,
    });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supervisors',
    });
  }
};

/**
 * GET /api/users/available
 * Obtener usuarios activos disponibles para asignar
 */
export const getAvailableUsers = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { role_type } = req.query; // 'agent', 'supervisor', 'all'

    let roleFilter = {};

    if (role_type) {
      let roleNames = [];
      
      if (role_type === 'agent') {
        roleNames = ['agente', 'agent', 'asesor'];
      } else if (role_type === 'supervisor') {
        roleNames = ['supervisor', 'admin'];
      }

      if (roleNames.length > 0) {
        const roles = await prisma.roles.findMany({
          where: {
            company_id: companyId,
            OR: roleNames.map(name => ({
              name: { contains: name, mode: 'insensitive' }
            })),
          },
          select: { id: true },
        });

        roleFilter = { role_id: { in: roles.map(r => r.id) } };
      }
    }

    const users = await prisma.users.findMany({
      where: {
        company_id: companyId,
        status: 'active',
        ...roleFilter,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo_url: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching available users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available users',
    });
  }
};

/**
 * GET /api/users/:id
 * Obtener un usuario específico
 */
export const getUserById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const user = await prisma.users.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        photo_url: true,
        last_access: true,
        created_at: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        schedule: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
};