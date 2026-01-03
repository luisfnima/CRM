// src/controllers/users.controller.js
import { prisma } from '../lib/prisma.js';
import {
  hashPassword,
  encryptPassword,
  generateSecurePassword,
} from '../lib/password-vault.js';

/**
 * GET /api/users
 * Obtener todos los usuarios de la compañía
 */
export const getAllUsers = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    console.log('🔍 Company ID:', companyId); // DEBUG

    if (!companyId) {
      return res.status(400).json({
        error: 'Company ID is required',
      });
    }

    const users = await prisma.users.findMany({
      where: {
        company_id: companyId,
      },
      include: {
        role: true,
        branch: true,
        schedule: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    console.log('📊 Usuarios encontrados:', users.length); // DEBUG
    console.log('👤 Primer usuario:', users[0]); // DEBUG

    // Excluir password_hash de la respuesta
    const usersWithoutPassword = users.map(({ password_hash, password, ...user }) => user);

    console.log('✅ Enviando usuarios al frontend:', usersWithoutPassword); // DEBUG

    return res.json(usersWithoutPassword);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/users/:id
 * Obtener un usuario por ID
 */
export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const companyId = req.user?.companyId;

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        company_id: companyId,
      },
      include: {
        role: true,
        branch: true,
        schedule: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const { password_hash, password, ...userWithoutPassword } = user;

    return res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/users
 * Crea un nuevo usuario y guarda su password en el vault
 */

export const createUser = async (req, res) => {
    try {
      console.log('═══════════════════════════════════════');
  
      const {
        companyId,
        name,
        email,
        roleId,
        role_id,
        branchId,
        branch_id,
        scheduleId,
        schedule_id,
        phone,
        photo_url,
        password: providedPassword,
      } = req.body;

      // ⬇️ EXTRAER SOLO EL PREFIJO DEL EMAIL (sin el dominio)
      const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
      console.log('📧 Email recibido:', email);
      console.log('📧 Email a guardar (solo prefijo):', emailPrefix);
  
      console.log('📸 photo_url recibido:', photo_url);
  
      const createdBy = req.user?.userId;
      const finalCompanyId = companyId || req.user?.companyId;
  
      const finalRoleId = (roleId || role_id) ? parseInt(roleId || role_id, 10) : null;
      const finalBranchId = (branchId || branch_id) ? parseInt(branchId || branch_id, 10) : null;
      const finalScheduleId = (scheduleId || schedule_id) ? parseInt(scheduleId || schedule_id, 10) : null;
  
      // Validación
      if (!finalCompanyId || !name || !email || !createdBy) {
        return res.status(400).json({
          error: 'Company ID, name, and email are required',
        });
      }
  
      // Verificar que el email no exista
      const existingUser = await prisma.users.findUnique({
        where: {
          company_id_email: {
            company_id: finalCompanyId,
            email: emailPrefix,  // ⬅️ Cambiar aquí
          },
        },
      });
  
      if (existingUser) {
        return res.status(409).json({
          error: 'Email already exists',
        });
      }
  
      const plainPassword = providedPassword || generateSecurePassword(12);
      const passwordHash = await hashPassword(plainPassword);
      const encryptedPassword = encryptPassword(plainPassword);
  
      // Crear usuario SIN photo_url (workaround por bug de Prisma)
      let user = await prisma.users.create({
        data: {
          company_id: finalCompanyId,
          name,
          email: emailPrefix,
          password: passwordHash,
          role_id: finalRoleId || null,
          branch_id: finalBranchId || null,
          schedule_id: finalScheduleId || null,
          phone: phone || null,
          status: 'active',
        },
      });
  
      console.log('✅ Usuario creado (sin foto):', user.id);
  
      // Si hay photo_url, actualizarlo inmediatamente
      if (photo_url) {
        console.log('📸 Actualizando photo_url...');
        
        await prisma.users.update({
          where: { id: user.id },
          data: { photo_url: photo_url },
        });
  
        // Refrescar el objeto user con el photo_url actualizado
        user = await prisma.users.findUnique({
          where: { id: user.id },
        });
  
        console.log('✅ Photo URL actualizado:', user.photo_url);
      }
  
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
  
      console.log('═══════════════════════════════════════');
  
      return res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          photo_url: user.photo_url,
        },
        password: plainPassword,
      });
    } catch (error) {
      console.error('❌ ERROR CREATING USER:', error);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  };

/**
 * PUT /api/users/:id
 * Actualizar un usuario
 */
export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const {
      name,
      email,
      password,
      roleId,
      role_id,
      branchId,
      branch_id,
      scheduleId,
      schedule_id,
      phone,
      photoUrl,
      photo_url,
      status,
    } = req.body;


    const emailPrefix = email && email.includes('@') ? email.split('@')[0] : email;

    console.log('📸 Photo URL recibida en backend:', photo_url); // ⬅️ AGREGAR

    const updatedBy = req.user?.userId;

    const finalRoleId = (roleId || role_id) ? parseInt(roleId || role_id, 10) : null;
    const finalBranchId = (branchId || branch_id) ? parseInt(branchId || branch_id, 10) : null;
    const finalScheduleId = (scheduleId || schedule_id) ? parseInt(scheduleId || schedule_id, 10) : null;
    const finalPhotoUrl = photoUrl || photo_url;  // ⬅️ AGREGAR ESTA LÍNEA SI NO ESTÁ


    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const updateData = {
      name,
      email: emailPrefix,
      role_id: finalRoleId !== undefined ? finalRoleId : undefined,
      branch_id: finalBranchId !== undefined ? finalBranchId : undefined,
      schedule_id: finalScheduleId !== undefined ? finalScheduleId : undefined,
      phone,
      photo_url: finalPhotoUrl,
      status,
      updated_at: new Date(),
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    if (password) {
      const passwordHash = await hashPassword(password);
      updateData.password = passwordHash;

      const encryptedPassword = encryptPassword(password);
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

        await prisma.password_access_log.create({
          data: {
            vault_id: vaultEntry.id,
            accessed_by: updatedBy,
            action: 'update',
            ip_address: req.ip || req.socket.remoteAddress || 'unknown',
          },
        });
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: true,
        branch: true,
        schedule: true,
      },
    });

    const { password_hash, password: _, ...userWithoutPassword } = updatedUser;

    return res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * DELETE /api/users/:id
 * Eliminar un usuario
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const deletedBy = req.user?.userId;

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (userId === deletedBy) {
      return res.status(400).json({
        error: 'Cannot delete your own user account',
      });
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    return res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * PATCH /api/users/:id/toggle-status
 * Cambiar estado activo/inactivo de un usuario
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const currentUserId = req.user?.userId; // ⬅️ Usuario que está haciendo la acción


    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }


    // ⬇️ NUEVA VALIDACIÓN: No puede desactivarse a sí mismo
    if (userId === currentUserId) {
      return res.status(400).json({
        error: 'No puedes cambiar tu propio estado',
      });
    }


    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        status: newStatus,
        updated_at: new Date(),
      },
      include: {
        role: true,
        branch: true,
        schedule: true,
      },
    });

    const { password_hash, password, ...userWithoutPassword } = updatedUser;

    return res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
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

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const plainPassword = newPassword || generateSecurePassword(12);
    const passwordHash = await hashPassword(plainPassword);
    const encryptedPassword = encryptPassword(plainPassword);

    await prisma.users.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        updated_at: new Date(),
      },
    });

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

      await prisma.password_access_log.create({
        data: {
          vault_id: vaultEntry.id,
          accessed_by: resetBy,
          action: 'reset',
          ip_address: req.ip || req.socket.remoteAddress || 'unknown',
        },
      });
    } else {
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
      password: plainPassword,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// ==================== HELPERS PARA USERS (ACTUALIZADO CON role_type) ====================
// Agregar estos métodos al final del archivo users.controller.js existente
// REEMPLAZAR los métodos anteriores si ya existen

/**
 * GET /api/users/agents
 * Obtener solo usuarios con role_type = 'agent'
 */
export const getAgents = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { status = 'active' } = req.query;

    // Buscar roles con role_type = 'agent'
    const agentRoles = await prisma.roles.findMany({
      where: {
        company_id: companyId,
        role_type: 'agent',
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
            role_type: true,
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
 * Obtener solo usuarios con role_type = 'supervisor'
 */
export const getSupervisors = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { status = 'active' } = req.query;

    // Buscar roles con role_type = 'supervisor'
    const supervisorRoles = await prisma.roles.findMany({
      where: {
        company_id: companyId,
        role_type: 'supervisor',
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
            role_type: true,
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
 * Query params: role_type (admin, supervisor, backoffice, agent)
 */
export const getAvailableUsers = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { role_type } = req.query;

    let roleFilter = {};

    if (role_type) {
      // Validar que sea un role_type válido
      const validTypes = ['admin', 'supervisor', 'backoffice', 'agent'];
      
      if (validTypes.includes(role_type)) {
        const roles = await prisma.roles.findMany({
          where: {
            company_id: companyId,
            role_type: role_type,
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
            role_type: true,
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