// src/controllers/companies.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/companies/me
 * Obtener información de la empresa actual del usuario
 */
export const getMyCompany = async (req, res) => {
  console.log('🚀 getMyCompany llamado'); // ← AGREGAR PRIMERA LÍNEA
  
  try {
    const { companyId } = req.user;
    
    console.log('🔍 Company ID:', companyId);
    console.log('🔍 req.user completo:', req.user);

    const company = await prisma.companies.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        domain: true,
        owner: true,
        primary_color: true,
        secondary_color: true,
        logo_url: true,
        active: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            users: true,
            campaigns: true,
            leads: true,
          },
        },
      },
    });

    console.log('✅ Company encontrada:', company);

    if (!company) {
      console.log('❌ Company NO encontrada');
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('❌❌❌ ERROR COMPLETO:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company',
      debug: error.message, // ← AGREGAR PARA VER EL ERROR EN LA RESPUESTA
    });
  }
};

/**
 * GET /api/companies/:id
 * Obtener información de una empresa específica
 */
export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    // Solo puede ver su propia empresa
    if (parseInt(id) !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const company = await prisma.companies.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            users: true,
            campaigns: true,
            leads: true,
            branches: true,
            roles: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company',
    });
  }
};

/**
 * PUT /api/companies/:id
 * Actualizar información de la empresa
 */
export const updateCompany = async (req, res) => {
  try {
    const { companyId, userId } = req.user;
    const { id } = req.params;
    const { name, owner, primary_color, secondary_color, logo_url, active } = req.body;

    // Solo puede actualizar su propia empresa
    if (parseInt(id) !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const existingCompany = await prisma.companies.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (owner !== undefined) updateData.owner = owner;
    if (primary_color !== undefined) updateData.primary_color = primary_color;
    if (secondary_color !== undefined) updateData.secondary_color = secondary_color;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (active !== undefined) updateData.active = active;
    
    updateData.updated_at = new Date();

    if (Object.keys(updateData).length === 1) { // Solo updated_at
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const company = await prisma.companies.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company',
    });
  }
};

/**
 * POST /api/companies/:id/logo
 * Subir logo de la empresa (acepta URL de Cloudinary)
 */
export const uploadLogo = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const { logo_url } = req.body;

    // Solo puede actualizar su propia empresa
    if (parseInt(id) !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    if (!logo_url) {
      return res.status(400).json({
        success: false,
        error: 'logo_url is required',
      });
    }

    const company = await prisma.companies.update({
      where: { id: parseInt(id) },
      data: {
        logo_url,
        updated_at: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        id: company.id,
        logo_url: company.logo_url,
      },
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload logo',
    });
  }
};

/**
 * DELETE /api/companies/:id/logo
 * Eliminar logo de la empresa
 */
export const deleteLogo = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    // Solo puede actualizar su propia empresa
    if (parseInt(id) !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const company = await prisma.companies.update({
      where: { id: parseInt(id) },
      data: {
        logo_url: null,
        updated_at: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Logo deleted successfully',
      data: {
        id: company.id,
        logo_url: company.logo_url,
      },
    });
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete logo',
    });
  }
};

/**
 * GET /api/companies/:id/stats
 * Obtener estadísticas de la empresa
 */
export const getCompanyStats = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    // Solo puede ver su propia empresa
    if (parseInt(id) !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const [
      totalUsers,
      activeUsers,
      totalCampaigns,
      activeCampaigns,
      totalLeads,
      totalSales,
    ] = await Promise.all([
      prisma.users.count({ where: { company_id: companyId } }),
      prisma.users.count({ where: { company_id: companyId, status: 'active' } }),
      prisma.campaigns.count({ where: { company_id: companyId } }),
      prisma.campaigns.count({ where: { company_id: companyId, status: 'active' } }),
      prisma.leads.count({ where: { company_id: companyId } }),
      prisma.sales.count({
        where: {
          lead_campaign: {
            campaign: {
              company_id: companyId,
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        campaigns: {
          total: totalCampaigns,
          active: activeCampaigns,
          inactive: totalCampaigns - activeCampaigns,
        },
        leads: {
          total: totalLeads,
        },
        sales: {
          total: totalSales,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company stats',
    });
  }
};