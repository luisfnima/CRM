// src/controllers/campaigns.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/campaigns
 * Listar todas las campañas de una empresa
 */
export const getAllCampaigns = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { status, page = 1, limit = 20 } = req.query;

    const where = { company_id: companyId };
    
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      prisma.campaigns.findMany({
        where,
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: {
              campaign_users: true,
              lead_campaign: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.campaigns.count({ where }),
    ]);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/campaigns/:id
 * Obtener una campaña específica
 */
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        campaign_users: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        status_tabs: {
          include: {
            statuses: true,
          },
          orderBy: { display_order: 'asc' },
        },
        field_blocks: {
          include: {
            fields: {
              orderBy: { display_order: 'asc' },
            },
          },
          orderBy: { display_order: 'asc' },
        },
        _count: {
          select: {
            lead_campaign: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/campaigns
 * Crear nueva campaña
 */
export const createCampaign = async (req, res) => {
  try {

    const companyId = req.user?.companyId;
    const createdBy = req.user?.userId;
    const {
      name,
      description,
      type,
      start_date,
      end_date,
      target_sales,
      status = 'draft',
    } = req.body;

    

    const campaign = await prisma.campaigns.create({
      data: {
        company_id: companyId,
        name,
        description,
        type,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        target_sales: target_sales || 0,
        status,
        created_by: createdBy,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: campaign,
      message: 'Campaign created successfully',
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * PUT /api/campaigns/:id
 * Actualizar campaña
 */
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;
    const {
      name,
      description,
      type,
      start_date,
      end_date,
      target_sales,
      status,
    } = req.body;

    // Verificar que la campaña existe y pertenece a la empresa
    const existingCampaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingCampaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (start_date !== undefined) updateData.start_date = new Date(start_date);
    if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date) : null;
    if (target_sales !== undefined) updateData.target_sales = target_sales;
    if (status !== undefined) updateData.status = status;

    const campaign = await prisma.campaigns.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign updated successfully',
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * DELETE /api/campaigns/:id
 * Eliminar campaña
 */
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    await prisma.campaigns.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/campaigns/:id/users
 * Obtener usuarios asignados a la campaña
 */
export const getCampaignUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const users = await prisma.campaign_users.findMany({
      where: { campaign_id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting campaign users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/campaigns/:id/users
 * Asignar usuario a campaña
 */
export const assignUserToCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, campaignRole } = req.body;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Verificar que el usuario existe y pertenece a la empresa
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        company_id: companyId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Verificar si ya está asignado
    const existingAssignment = await prisma.campaign_users.findFirst({
      where: {
        campaign_id: parseInt(id),
        user_id: userId,
        campaign_role: campaignRole,
      },
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        error: 'User already assigned to this campaign with this role',
      });
    }

    const assignment = await prisma.campaign_users.create({
      data: {
        campaign_id: parseInt(id),
        user_id: userId,
        campaign_role: campaignRole,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'User assigned to campaign successfully',
    });
  } catch (error) {
    console.error('Error assigning user to campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * DELETE /api/campaigns/:id/users/:userId
 * Quitar usuario de campaña
 */
export const removeUserFromCampaign = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { campaignRole } = req.query;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const where = {
      campaign_id: parseInt(id),
      user_id: parseInt(userId),
    };

    if (campaignRole) {
      where.campaign_role = campaignRole;
    }

    const assignment = await prisma.campaign_users.findFirst({ where });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'User assignment not found',
      });
    }

    await prisma.campaign_users.delete({
      where: { id: assignment.id },
    });

    res.json({
      success: true,
      message: 'User removed from campaign successfully',
    });
  } catch (error) {
    console.error('Error removing user from campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/campaigns/:id/statuses
 * Obtener estados de la campaña
 */
export const getCampaignStatuses = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const statusTabs = await prisma.status_tabs.findMany({
      where: { campaign_id: parseInt(id) },
      include: {
        statuses: {
          orderBy: { display_order: 'asc' },
        },
      },
      orderBy: { display_order: 'asc' },
    });

    res.json({
      success: true,
      data: statusTabs,
    });
  } catch (error) {
    console.error('Error getting campaign statuses:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/campaigns/:id/statuses
 * Crear estado en la campaña
 */
export const createCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status_tab_id,
      name,
      description,
      color = '#3B82F6',
      is_final = false,
      display_order = 0,
    } = req.body;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Verificar que el nombre no exista en la campaña
    const existingStatus = await prisma.statuses.findFirst({
      where: {
        campaign_id: parseInt(id),
        name,
      },
    });

    if (existingStatus) {
      return res.status(409).json({
        success: false,
        error: 'Status with this name already exists in this campaign',
      });
    }

    const status = await prisma.statuses.create({
      data: {
        campaign_id: parseInt(id),
        status_tab_id: status_tab_id || null,
        name,
        description,
        color,
        is_final,
        display_order,
      },
    });

    res.status(201).json({
      success: true,
      data: status,
      message: 'Status created successfully',
    });
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/campaigns/:id/fields
 * Obtener campos personalizados de la campaña
 */
export const getCampaignFields = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const fieldBlocks = await prisma.field_blocks.findMany({
      where: { campaign_id: parseInt(id) },
      include: {
        fields: {
          orderBy: { display_order: 'asc' },
        },
      },
      orderBy: { display_order: 'asc' },
    });

    res.json({
      success: true,
      data: fieldBlocks,
    });
  } catch (error) {
    console.error('Error getting campaign fields:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/campaigns/:id/fields
 * Crear campo personalizado en la campaña
 */
export const createCampaignField = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      block_id,
      name,
      label,
      field_type,
      options,
      default_value,
      placeholder,
      help_text,
      required = false,
      display_order = 0,
      validation_rules,
    } = req.body;
    const companyId = req.user?.companyId;

    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Verificar que el nombre no exista en la campaña
    const existingField = await prisma.fields.findFirst({
      where: {
        campaign_id: parseInt(id),
        name,
      },
    });

    if (existingField) {
      return res.status(409).json({
        success: false,
        error: 'Field with this name already exists in this campaign',
      });
    }

    const field = await prisma.fields.create({
      data: {
        campaign_id: parseInt(id),
        block_id: block_id || null,
        name,
        label,
        field_type,
        options: options || null,
        default_value,
        placeholder,
        help_text,
        required,
        display_order,
        validation_rules: validation_rules || null,
      },
    });

    res.status(201).json({
      success: true,
      data: field,
      message: 'Field created successfully',
    });
  } catch (error) {
    console.error('Error creating field:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};