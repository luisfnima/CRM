// src/controllers/sales.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/sales
 * Listar todas las ventas
 */
export const getAllSales = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { lead_campaign_id, status, product_id, limit = 100, offset = 0 } = req.query;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const where = {
      ...(isAdminOrSupervisor ? {} : { agent_id: userId }), // Si no es admin, solo ve sus ventas
      ...(lead_campaign_id && { lead_campaign_id: parseInt(lead_campaign_id) }),
      ...(status && { status }),
      ...(product_id && { product_id: parseInt(product_id) }),
    };

    const [sales, total] = await Promise.all([
      prisma.sales.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
            },
          },
          lead_campaign: {
            include: {
              lead: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  email: true,
                },
              },
              campaign: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.sales.count({ where }),
    ]);

    res.json({
      success: true,
      data: sales,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales',
    });
  }
};

/**
 * GET /api/sales/:id
 * Obtener una venta específica
 */
export const getSaleById = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const sale = await prisma.sales.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdminOrSupervisor ? {} : { agent_id: userId }),
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        lead_campaign: {
          include: {
            lead: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                dni: true,
                address: true,
              },
            },
            campaign: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found',
      });
    }

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sale',
    });
  }
};

/**
 * POST /api/sales
 * Crear nueva venta
 */
export const createSale = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      lead_campaign_id,
      product_id,
      amount,
      status = 'pending',
      sale_date,
      activation_date,
      notes,
    } = req.body;

    const sale = await prisma.sales.create({
      data: {
        lead_campaign_id,
        agent_id: userId,
        product_id,
        amount,
        status,
        sale_date: new Date(sale_date),
        activation_date: activation_date ? new Date(activation_date) : null,
        notes: notes || null,
      },
      include: {
        agent: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: sale,
    });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sale',
    });
  }
};

/**
 * PUT /api/sales/:id
 * Actualizar venta
 */
export const updateSale = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;
    const {
      status,
      amount,
      activation_date,
      notes,
    } = req.body;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    // Verificar que existe
    const existingSale = await prisma.sales.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdminOrSupervisor ? {} : { agent_id: userId }),
      },
    });

    if (!existingSale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found',
      });
    }

    // Preparar datos a actualizar
    const updateData = {};
    if (status) updateData.status = status;
    if (amount !== undefined) updateData.amount = amount;
    if (activation_date !== undefined) updateData.activation_date = activation_date ? new Date(activation_date) : null;
    if (notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const sale = await prisma.sales.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
      include: {
        agent: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Sale updated successfully',
      data: sale,
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update sale',
    });
  }
};

/**
 * DELETE /api/sales/:id
 * Eliminar venta (soft delete - cambia a cancelled)
 */
export const deleteSale = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    // Verificar que existe
    const existingSale = await prisma.sales.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdminOrSupervisor ? {} : { agent_id: userId }),
      },
    });

    if (!existingSale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found',
      });
    }

    const sale = await prisma.sales.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: 'cancelled',
      },
    });

    res.json({
      success: true,
      message: 'Sale cancelled successfully',
      data: sale,
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel sale',
    });
  }
};