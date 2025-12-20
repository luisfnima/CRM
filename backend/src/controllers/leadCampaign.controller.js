// src/controllers/leadCampaign.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/lead-campaign
 * Listar asignaciones de leads a campañas
 */
export const getAllLeadCampaigns = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { campaign_id, status_id, assigned_agent, limit = 100, offset = 0 } = req.query;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const where = {
      ...(campaign_id && { campaign_id: parseInt(campaign_id) }),
      ...(status_id && { status_id: parseInt(status_id) }),
      ...(assigned_agent && { assigned_agent: parseInt(assigned_agent) }),
      // Si no es admin, solo ve sus leads asignados
      ...(!isAdminOrSupervisor && { assigned_agent: userId }),
    };

    const [leadCampaigns, total] = await Promise.all([
      prisma.lead_campaign.findMany({
        where,
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
              type: true,
            },
          },
          status: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          assigned_agent_user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.lead_campaign.count({ where }),
    ]);

    res.json({
      success: true,
      data: leadCampaigns,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching lead campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead campaigns',
    });
  }
};

/**
 * GET /api/lead-campaign/:id
 * Obtener una asignación específica
 */
export const getLeadCampaignById = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const leadCampaign = await prisma.lead_campaign.findFirst({
      where: {
        id: parseInt(id),
        ...(!isAdminOrSupervisor && { assigned_agent: userId }),
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            dni: true,
            address: true,
            city: true,
            notes: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
          },
        },
        status: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            is_final: true,
          },
        },
        assigned_agent_user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        calls: {
          orderBy: {
            started_at: 'desc',
          },
          take: 10,
          select: {
            id: true,
            phone_number: true,
            call_type: true,
            duration: true,
            started_at: true,
            call_result: {
              select: {
                name: true,
              },
            },
          },
        },
        sales: {
          orderBy: {
            created_at: 'desc',
          },
          select: {
            id: true,
            amount: true,
            status: true,
            sale_date: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!leadCampaign) {
      return res.status(404).json({
        success: false,
        error: 'Lead campaign assignment not found',
      });
    }

    res.json({
      success: true,
      data: leadCampaign,
    });
  } catch (error) {
    console.error('Error fetching lead campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead campaign',
    });
  }
};

/**
 * POST /api/lead-campaign
 * Asignar lead a campaña
 */
export const createLeadCampaign = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      lead_id,
      campaign_id,
      status_id,
      assigned_agent,
      next_call_at,
    } = req.body;

    // Verificar si ya existe esta asignación
    const existing = await prisma.lead_campaign.findFirst({
      where: {
        lead_id,
        campaign_id,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Lead already assigned to this campaign',
      });
    }

    const leadCampaign = await prisma.lead_campaign.create({
      data: {
        lead_id,
        campaign_id,
        status_id: status_id || null,
        assigned_agent: assigned_agent || userId,
        attempts: 0,
        next_call_at: next_call_at ? new Date(next_call_at) : null,
      },
      include: {
        lead: {
          select: {
            name: true,
            phone: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lead assigned to campaign successfully',
      data: leadCampaign,
    });
  } catch (error) {
    console.error('Error creating lead campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign lead to campaign',
    });
  }
};

/**
 * PUT /api/lead-campaign/:id
 * Actualizar asignación
 */
export const updateLeadCampaign = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;
    const {
      status_id,
      assigned_agent,
      attempts,
      last_call_at,
      next_call_at,
    } = req.body;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const existing = await prisma.lead_campaign.findFirst({
      where: {
        id: parseInt(id),
        ...(!isAdminOrSupervisor && { assigned_agent: userId }),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Lead campaign assignment not found',
      });
    }

    const updateData = {};
    if (status_id !== undefined) updateData.status_id = status_id;
    if (assigned_agent !== undefined) updateData.assigned_agent = assigned_agent;
    if (attempts !== undefined) updateData.attempts = attempts;
    if (last_call_at !== undefined) updateData.last_call_at = last_call_at ? new Date(last_call_at) : null;
    if (next_call_at !== undefined) updateData.next_call_at = next_call_at ? new Date(next_call_at) : null;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const leadCampaign = await prisma.lead_campaign.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        status: {
          select: {
            name: true,
          },
        },
        assigned_agent_user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Lead campaign updated successfully',
      data: leadCampaign,
    });
  } catch (error) {
    console.error('Error updating lead campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update lead campaign',
    });
  }
};

/**
 * PUT /api/lead-campaign/:id/status
 * Cambiar estado del lead (crea historial)
 */
export const changeStatus = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;
    const { status_id, notes } = req.body;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const existing = await prisma.lead_campaign.findFirst({
      where: {
        id: parseInt(id),
        ...(!isAdminOrSupervisor && { assigned_agent: userId }),
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Lead campaign assignment not found',
      });
    }

    // Crear historial de cambio de estado
    await prisma.lead_status_history.create({
      data: {
        lead_campaign_id: parseInt(id),
        previous_status_id: existing.status_id,
        new_status_id: status_id,
        changed_by: userId,
        notes: notes || null,
      },
    });

    // Actualizar estado actual
    const leadCampaign = await prisma.lead_campaign.update({
      where: { id: parseInt(id) },
      data: {
        status_id,
      },
      include: {
        status: {
          select: {
            id: true,
            name: true,
            color: true,
            is_final: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Status changed successfully',
      data: leadCampaign,
    });
  } catch (error) {
    console.error('Error changing status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change status',
    });
  }
};

/**
 * PUT /api/lead-campaign/:id/assign-agent
 * Asignar agente al lead
 */
export const assignAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_agent } = req.body;

    const leadCampaign = await prisma.lead_campaign.update({
      where: { id: parseInt(id) },
      data: {
        assigned_agent,
      },
      include: {
        assigned_agent_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Agent assigned successfully',
      data: leadCampaign,
    });
  } catch (error) {
    console.error('Error assigning agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign agent',
    });
  }
};

/**
 * DELETE /api/lead-campaign/:id
 * Eliminar asignación de lead a campaña
 */
export const deleteLeadCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lead_campaign.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Lead campaign assignment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete lead campaign assignment',
    });
  }
};