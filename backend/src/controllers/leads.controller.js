// src/controllers/leads.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/leads
 * Listar todos los leads de una empresa
 */
export const getAllLeads = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { search, page = 1, limit = 20 } = req.query;

    const where = { company_id: companyId };

    if (search) {
      where.OR = [
        { phone: { contains: search } },
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { dni: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      prisma.leads.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.leads.count({ where }),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/leads/:id
 * Obtener un lead específico
 */
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const lead = await prisma.leads.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      include: {
        lead_campaign: {
          include: {
            campaign: {
              select: { id: true, name: true },
            },
            status: {
              select: { id: true, name: true, color: true },
            },
            agent: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        lead_list: {
          include: {
            list: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/leads
 * Crear lead manual
 */
export const createLead = async (req, res) => {
  try {
    const {
      phone,
      name,
      email,
      dni,
      address,
      city,
      state,
      country = 'ES',
      notes,
      metadata,
    } = req.body;

    const companyId = req.user?.companyId;

    // Verificar si el teléfono ya existe
    const existingLead = await prisma.leads.findFirst({
      where: {
        company_id: companyId,
        phone,
      },
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        error: 'Lead with this phone number already exists',
      });
    }

    // Verificar blacklist
    const isBlacklisted = await prisma.blacklists.findFirst({
      where: {
        company_id: companyId,
        value: phone,
      },
    });

    if (isBlacklisted) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is blacklisted',
        reason: isBlacklisted.reason,
      });
    }

    const lead = await prisma.leads.create({
      data: {
        company_id: companyId,
        phone,
        name,
        email,
        dni,
        address,
        city,
        state,
        country,
        notes,
        metadata: metadata || null,
      },
    });

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully',
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * PUT /api/leads/:id
 * Actualizar lead
 */
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;
    const {
      phone,
      name,
      email,
      dni,
      address,
      city,
      state,
      country,
      notes,
      metadata,
    } = req.body;

    const existingLead = await prisma.leads.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
      });
    }

    // Si se cambia el teléfono, verificar que no exista
    if (phone && phone !== existingLead.phone) {
      const phoneExists = await prisma.leads.findFirst({
        where: {
          company_id: companyId,
          phone,
          id: { not: parseInt(id) },
        },
      });

      if (phoneExists) {
        return res.status(409).json({
          success: false,
          error: 'Phone number already exists',
        });
      }
    }

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (dni !== undefined) updateData.dni = dni;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (notes !== undefined) updateData.notes = notes;
    if (metadata !== undefined) updateData.metadata = metadata;

    const lead = await prisma.leads.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      data: lead,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * DELETE /api/leads/:id
 * Eliminar lead
 */
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const lead = await prisma.leads.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
      });
    }

    await prisma.leads.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/leads/import
 * Importar leads desde Excel/CSV
 * TODO: Implementar lógica de lectura de archivos con multer + xlsx/csv-parser
 */
export const importLeads = async (req, res) => {
  try {
    const { name, description, campaignId } = req.body;
    const companyId = req.user?.companyId;
    const importedBy = req.user?.userId;

    // TODO: Procesar archivo con multer
    // TODO: Leer Excel/CSV con xlsx o csv-parser
    // TODO: Validar y crear leads en lote

    // Por ahora, solo creamos la lista
    const leadList = await prisma.lead_lists.create({
      data: {
        company_id: companyId,
        campaign_id: campaignId || null,
        name,
        description,
        file_name: req.file?.originalname || 'manual_import',
        file_type: req.file?.mimetype?.includes('csv') ? 'csv' : 'xlsx',
        total_records: 0,
        imported_records: 0,
        failed_records: 0,
        status: 'pending',
        imported_by: importedBy,
      },
    });

    res.status(201).json({
      success: true,
      data: leadList,
      message: 'Import initiated. Processing file...',
      note: 'File processing logic pending implementation',
    });
  } catch (error) {
    console.error('Error importing leads:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/leads/lists
 * Listar listas importadas
 */
export const getLeadLists = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const [lists, total] = await Promise.all([
      prisma.lead_lists.findMany({
        where: { company_id: companyId },
        include: {
          campaign: {
            select: { id: true, name: true },
          },
          importer: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { imported_at: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.lead_lists.count({ where: { company_id: companyId } }),
    ]);

    res.json({
      success: true,
      data: lists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting lead lists:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/leads/lists/:id
 * Ver lista importada específica
 */
export const getLeadListById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const list = await prisma.lead_lists.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      include: {
        campaign: {
          select: { id: true, name: true },
        },
        importer: {
          select: { id: true, name: true, email: true },
        },
        column_mappings: true,
        lead_list: {
          include: {
            lead: true,
          },
          take: 100, // Limitar a 100 leads por lista
        },
      },
    });

    if (!list) {
      return res.status(404).json({
        success: false,
        error: 'Lead list not found',
      });
    }

    res.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error('Error getting lead list:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/leads/:id/assign
 * Asignar lead a campaña
 */
export const assignLeadToCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { campaignId, statusId, assignedAgent } = req.body;
    const companyId = req.user?.companyId;

    const lead = await prisma.leads.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
      });
    }

    // Verificar que la campaña existe
    const campaign = await prisma.campaigns.findFirst({
      where: {
        id: campaignId,
        company_id: companyId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Verificar si ya está asignado
    const existing = await prisma.lead_campaign.findFirst({
      where: {
        lead_id: parseInt(id),
        campaign_id: campaignId,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Lead already assigned to this campaign',
      });
    }

    const assignment = await prisma.lead_campaign.create({
      data: {
        lead_id: parseInt(id),
        campaign_id: campaignId,
        status_id: statusId || null,
        assigned_agent: assignedAgent || null,
      },
      include: {
        campaign: {
          select: { id: true, name: true },
        },
        status: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'Lead assigned to campaign successfully',
    });
  } catch (error) {
    console.error('Error assigning lead to campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/blacklist
 * Listar números bloqueados
 */
export const getBlacklist = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const [blacklist, total] = await Promise.all([
      prisma.blacklists.findMany({
        where: { company_id: companyId },
        include: {
          adder: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { added_at: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.blacklists.count({ where: { company_id: companyId } }),
    ]);

    res.json({
      success: true,
      data: blacklist,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting blacklist:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/blacklist
 * Agregar número a blacklist
 */
export const addToBlacklist = async (req, res) => {
  try {
    const { value, reason } = req.body;
    const companyId = req.user?.companyId;
    const addedBy = req.user?.userId;

    // Verificar si ya existe
    const existing = await prisma.blacklists.findFirst({
      where: {
        company_id: companyId,
        value,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Phone number already in blacklist',
      });
    }

    const blacklist = await prisma.blacklists.create({
      data: {
        company_id: companyId,
        value,
        reason,
        added_by: addedBy,
      },
      include: {
        adder: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: blacklist,
      message: 'Phone number added to blacklist',
    });
  } catch (error) {
    console.error('Error adding to blacklist:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * DELETE /api/blacklist/:id
 * Quitar número de blacklist
 */
export const removeFromBlacklist = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const blacklist = await prisma.blacklists.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!blacklist) {
      return res.status(404).json({
        success: false,
        error: 'Blacklist entry not found',
      });
    }

    await prisma.blacklists.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Phone number removed from blacklist',
    });
  } catch (error) {
    console.error('Error removing from blacklist:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};