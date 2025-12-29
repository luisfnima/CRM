// src/controllers/roles.controller.js
// CREAR ESTE ARCHIVO NUEVO
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/roles
 * Listar todos los roles de la empresa
 */
export const getAllRoles = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { active, role_type } = req.query;

    const where = {
      company_id: companyId,
      ...(active !== undefined && { active: active === 'true' }),
      ...(role_type && { role_type }),
    };

    const roles = await prisma.roles.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        role_type: true,
        permissions: true,
        active: true,
        created_at: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roles',
    });
  }
};

/**
 * GET /api/roles/:id
 * Obtener un rol específico
 */
export const getRoleById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const role = await prisma.roles.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role',
    });
  }
};

/**
 * POST /api/roles
 * Crear nuevo rol
 */
export const createRole = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      name,
      description,
      role_type,
      permissions = {},
      active = true,
    } = req.body;

    // Verificar que no exista un rol con el mismo nombre
    const existingRole = await prisma.roles.findFirst({
      where: {
        company_id: companyId,
        name,
      },
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        error: 'A role with this name already exists',
      });
    }

    const role = await prisma.roles.create({
      data: {
        company_id: companyId,
        name,
        description: description || null,
        role_type,
        permissions,
        active,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create role',
    });
  }
};

/**
 * PUT /api/roles/:id
 * Actualizar rol
 */
export const updateRole = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const { name, description, role_type, permissions, active } = req.body;

    const existingRole = await prisma.roles.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Si se cambia el nombre, verificar que no exista otro rol con ese nombre
    if (name && name !== existingRole.name) {
      const duplicateRole = await prisma.roles.findFirst({
        where: {
          company_id: companyId,
          name,
          id: { not: parseInt(id) },
        },
      });

      if (duplicateRole) {
        return res.status(409).json({
          success: false,
          error: 'A role with this name already exists',
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (role_type !== undefined) updateData.role_type = role_type;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (active !== undefined) updateData.active = active;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const role = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update role',
    });
  }
};

/**
 * DELETE /api/roles/:id
 * Eliminar rol (soft delete)
 */
export const deleteRole = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const existingRole = await prisma.roles.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    const role = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });

    res.json({
      success: true,
      message: 'Role deleted successfully',
      data: role,
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete role',
    });
  }
};