// src/controllers/statuses.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/statuses/campaign/:campaignId
 * Obtener todos los estados de una campaña
 */
export const getStatusesByCampaign = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { campaignId } = req.params;

    // Verificar que la campaña pertenece a la empresa
    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(campaignId),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const statuses = await prisma.statuses.findMany({
      where: {
        campaign_id: parseInt(campaignId),
      },
      include: {
        status_tabs: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        _count: {
          select: {
            lead_campaign: true,
          },
        },
      },
      orderBy: [
        { status_tab_id: 'asc' },
        { display_order: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statuses',
    });
  }
};

/**
 * GET /api/statuses/:id
 * Obtener un estado específico
 */
export const getStatusById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const status = await prisma.statuses.findFirst({
      where: {
        id: parseInt(id),
        campaign: {
          company_id: companyId,
        },
      },
      include: {
        status_tabs: true,
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Status not found',
      });
    }

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch status',
    });
  }
};

/**
 * POST /api/statuses
 * Crear nuevo estado
 */
export const createStatus = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      campaign_id,
      status_tab_id,
      name,
      description,
      color = '#3b82f6',
      is_final = false,
      is_global = false,
      display_order = 0,
    } = req.body;

    // Verificar que la campaña pertenece a la empresa
    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: campaign_id,
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Verificar que no exista un estado con el mismo nombre en la campaña
    const existingStatus = await prisma.statuses.findFirst({
      where: {
        campaign_id,
        name,
      },
    });

    if (existingStatus) {
      return res.status(409).json({
        success: false,
        error: 'A status with this name already exists in this campaign',
      });
    }

    // Si se proporciona status_tab_id, verificar que pertenece a la campaña
    if (status_tab_id) {
      const statusTab = await prisma.status_tabs.findFirst({
        where: {
          id: status_tab_id,
          campaign_id,
        },
      });

      if (!statusTab) {
        return res.status(404).json({
          success: false,
          error: 'Status tab not found in this campaign',
        });
      }
    }

    const status = await prisma.statuses.create({
      data: {
        campaign_id,
        status_tab_id: status_tab_id || null,
        name,
        description: description || null,
        color,
        is_final,
        is_global,
        display_order,
      },
      include: {
        status_tabs: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Status created successfully',
      data: status,
    });
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create status',
    });
  }
};

/**
 * PUT /api/statuses/:id
 * Actualizar estado
 */
export const updateStatus = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const { name, description, status_tab_id, color, is_final, is_global, display_order } = req.body;

    // Verificar que el estado existe y pertenece a una campaña de la empresa
    const existingStatus = await prisma.statuses.findFirst({
      where: {
        id: parseInt(id),
        campaign: {
          company_id: companyId,
        },
      },
    });

    if (!existingStatus) {
      return res.status(404).json({
        success: false,
        error: 'Status not found',
      });
    }

    // Si se cambia el nombre, verificar que no exista otro con ese nombre
    if (name && name !== existingStatus.name) {
      const duplicateStatus = await prisma.statuses.findFirst({
        where: {
          campaign_id: existingStatus.campaign_id,
          name,
          id: { not: parseInt(id) },
        },
      });

      if (duplicateStatus) {
        return res.status(409).json({
          success: false,
          error: 'A status with this name already exists in this campaign',
        });
      }
    }

    // Si se cambia el status_tab_id, verificar que pertenece a la campaña
    if (status_tab_id !== undefined && status_tab_id !== null) {
      const statusTab = await prisma.status_tabs.findFirst({
        where: {
          id: status_tab_id,
          campaign_id: existingStatus.campaign_id,
        },
      });

      if (!statusTab) {
        return res.status(404).json({
          success: false,
          error: 'Status tab not found in this campaign',
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status_tab_id !== undefined) updateData.status_tab_id = status_tab_id;
    if (color !== undefined) updateData.color = color;
    if (is_final !== undefined) updateData.is_final = is_final;
    if (is_global !== undefined) updateData.is_global = is_global;
    if (display_order !== undefined) updateData.display_order = display_order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const status = await prisma.statuses.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        status_tabs: true,
      },
    });

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: status,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status',
    });
  }
};

/**
 * DELETE /api/statuses/:id
 * Eliminar estado
 */
export const deleteStatus = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    // Verificar que el estado existe y pertenece a una campaña de la empresa
    const existingStatus = await prisma.statuses.findFirst({
      where: {
        id: parseInt(id),
        campaign: {
          company_id: companyId,
        },
      },
      include: {
        _count: {
          select: {
            lead_campaign: true,
          },
        },
      },
    });

    if (!existingStatus) {
      return res.status(404).json({
        success: false,
        error: 'Status not found',
      });
    }

    // Verificar que no hay leads con este estado
    if (existingStatus._count.lead_campaign > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete status. ${existingStatus._count.lead_campaign} leads are currently using this status.`,
      });
    }

    await prisma.statuses.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Status deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete status',
    });
  }
};