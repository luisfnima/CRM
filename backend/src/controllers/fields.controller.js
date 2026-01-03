// src/controllers/fields.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/fields/campaign/:campaignId
 * Obtener todos los campos de una campaña
 */
export const getFieldsByCampaign = async (req, res) => {
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

    const fields = await prisma.fields.findMany({
      where: {
        campaign_id: parseInt(campaignId),
      },
      include: {
        block: {
          select: {
            id: true,
            name: true,
            description: true,
            display_order: true,
          },
        },
      },
      orderBy: [
        { block_id: 'asc' },
        { display_order: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: fields,
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fields',
    });
  }
};

/**
 * GET /api/fields/:id
 * Obtener un campo específico
 */
export const getFieldById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const field = await prisma.fields.findFirst({
      where: {
        id: parseInt(id),
        campaign: {
          company_id: companyId,
        },
      },
      include: {
        block: true,
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        error: 'Field not found',
      });
    }

    res.json({
      success: true,
      data: field,
    });
  } catch (error) {
    console.error('Error fetching field:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch field',
    });
  }
};

/**
 * POST /api/fields
 * Crear nuevo campo
 */
export const createField = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      campaign_id,
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

    // Verificar que no exista un campo con el mismo nombre en la campaña
    const existingField = await prisma.fields.findFirst({
      where: {
        campaign_id,
        name,
      },
    });

    if (existingField) {
      return res.status(409).json({
        success: false,
        error: 'A field with this name already exists in this campaign',
      });
    }

    // Si se proporciona block_id, verificar que pertenece a la campaña
    if (block_id) {
      const block = await prisma.field_blocks.findFirst({
        where: {
          id: block_id,
          campaign_id,
        },
      });

      if (!block) {
        return res.status(404).json({
          success: false,
          error: 'Field block not found in this campaign',
        });
      }
    }

    const field = await prisma.fields.create({
      data: {
        campaign_id,
        block_id: block_id || null,
        name,
        label,
        field_type,
        options: options || null,
        default_value: default_value || null,
        placeholder: placeholder || null,
        help_text: help_text || null,
        required,
        display_order,
        validation_rules: validation_rules || null,
      },
      include: {
        block: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Field created successfully',
      data: field,
    });
  } catch (error) {
    console.error('Error creating field:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create field',
    });
  }
};

/**
 * PUT /api/fields/:id
 * Actualizar campo
 */
export const updateField = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const {
      name,
      label,
      field_type,
      block_id,
      options,
      default_value,
      placeholder,
      help_text,
      required,
      display_order,
      validation_rules,
    } = req.body;

    // Verificar que el campo existe y pertenece a una campaña de la empresa
    const existingField = await prisma.fields.findFirst({
      where: {
        id: parseInt(id),
        campaign: {
          company_id: companyId,
        },
      },
    });

    if (!existingField) {
      return res.status(404).json({
        success: false,
        error: 'Field not found',
      });
    }

    // Si se cambia el nombre, verificar que no exista otro con ese nombre
    if (name && name !== existingField.name) {
      const duplicateField = await prisma.fields.findFirst({
        where: {
          campaign_id: existingField.campaign_id,
          name,
          id: { not: parseInt(id) },
        },
      });

      if (duplicateField) {
        return res.status(409).json({
          success: false,
          error: 'A field with this name already exists in this campaign',
        });
      }
    }

    // Si se cambia el block_id, verificar que pertenece a la campaña
    if (block_id !== undefined && block_id !== null) {
      const block = await prisma.field_blocks.findFirst({
        where: {
          id: block_id,
          campaign_id: existingField.campaign_id,
        },
      });

      if (!block) {
        return res.status(404).json({
          success: false,
          error: 'Field block not found in this campaign',
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (label !== undefined) updateData.label = label;
    if (field_type !== undefined) updateData.field_type = field_type;
    if (block_id !== undefined) updateData.block_id = block_id;
    if (options !== undefined) updateData.options = options;
    if (default_value !== undefined) updateData.default_value = default_value;
    if (placeholder !== undefined) updateData.placeholder = placeholder;
    if (help_text !== undefined) updateData.help_text = help_text;
    if (required !== undefined) updateData.required = required;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (validation_rules !== undefined) updateData.validation_rules = validation_rules;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const field = await prisma.fields.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        block: true,
      },
    });

    res.json({
      success: true,
      message: 'Field updated successfully',
      data: field,
    });
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update field',
    });
  }
};

/**
 * DELETE /api/fields/:id
 * Eliminar campo
 */
export const deleteField = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    // Verificar que el campo existe y pertenece a una campaña de la empresa
    const existingField = await prisma.fields.findFirst({
      where: {
        id: parseInt(id),
        campaign: {
          company_id: companyId,
        },
      },
      include: {
        _count: {
          select: {
            lead_field_values: true,
            sale_field_values: true,
          },
        },
      },
    });

    if (!existingField) {
      return res.status(404).json({
        success: false,
        error: 'Field not found',
      });
    }

    // Verificar que no hay datos asociados
    const totalValues = existingField._count.lead_field_values + existingField._count.sale_field_values;
    if (totalValues > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete field. ${totalValues} records are using this field.`,
      });
    }

    await prisma.fields.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Field deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting field:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete field',
    });
  }
};