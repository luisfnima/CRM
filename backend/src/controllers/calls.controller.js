// src/controllers/calls.controller.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/calls
 * Listar todas las llamadas del agente actual
 */
export const getAllCalls = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { lead_campaign_id, call_type, call_result_id, limit = 100, offset = 0 } = req.query;

    // Verificar si es admin/supervisor (pueden ver todas las llamadas)
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const where = {
      ...(isAdminOrSupervisor ? {} : { agent_id: userId }), // Si no es admin, solo ve sus llamadas
      ...(lead_campaign_id && { lead_campaign_id: parseInt(lead_campaign_id) }),
      ...(call_type && { call_type }),
      ...(call_result_id && { call_result_id: parseInt(call_result_id) }),
    };

    const [calls, total] = await Promise.all([
      prisma.calls.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          call_result: {
            select: {
              id: true,
              name: true,
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
          started_at: 'desc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.calls.count({ where }),
    ]);

    res.json({
      success: true,
      data: calls,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calls',
    });
  }
};

/**
 * GET /api/calls/:id
 * Obtener una llamada específica
 */
export const getCallById = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    const call = await prisma.calls.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdminOrSupervisor ? {} : { agent_id: userId }), // Si no es admin, solo ve sus llamadas
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        call_result: {
          select: {
            id: true,
            name: true,
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

    if (!call) {
      return res.status(404).json({
        success: false,
        error: 'Call not found',
      });
    }

    res.json({
      success: true,
      data: call,
    });
  } catch (error) {
    console.error('Error fetching call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call',
    });
  }
};

/**
 * POST /api/calls
 * Registrar nueva llamada
 */
export const createCall = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      lead_campaign_id,
      phone_number,
      call_type = 'outbound',
      call_result_id,
      duration = 0,
      recording_url,
      notes,
      started_at,
      ended_at,
    } = req.body;

    const call = await prisma.calls.create({
      data: {
        lead_campaign_id,
        agent_id: userId,
        phone_number,
        call_type,
        call_result_id: call_result_id || null,
        duration,
        recording_url: recording_url || null,
        notes: notes || null,
        started_at: new Date(started_at),
        ended_at: ended_at ? new Date(ended_at) : null,
      },
      include: {
        agent: {
          select: {
            name: true,
          },
        },
        call_result: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Call registered successfully',
      data: call,
    });
  } catch (error) {
    console.error('Error creating call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register call',
    });
  }
};

/**
 * PUT /api/calls/:id
 * Actualizar llamada
 */
export const updateCall = async (req, res) => {
  try {
    const { userId, roleId } = req.user;
    const { id } = req.params;
    const { duration, call_result_id, notes, recording_url, ended_at } = req.body;

    // Verificar si es admin/supervisor
    const role = await prisma.roles.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    const isAdminOrSupervisor = role && ['admin', 'supervisor'].includes(role.name.toLowerCase());

    // Verificar que la llamada existe y pertenece al agente (o es admin)
    const existingCall = await prisma.calls.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdminOrSupervisor ? {} : { agent_id: userId }),
      },
    });

    if (!existingCall) {
      return res.status(404).json({
        success: false,
        error: 'Call not found',
      });
    }

    // Preparar datos a actualizar
    const updateData = {};
    if (duration !== undefined) updateData.duration = duration;
    if (call_result_id !== undefined) updateData.call_result_id = call_result_id;
    if (notes !== undefined) updateData.notes = notes;
    if (recording_url !== undefined) updateData.recording_url = recording_url;
    if (ended_at !== undefined) updateData.ended_at = ended_at ? new Date(ended_at) : null;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const call = await prisma.calls.update({
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
        call_result: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Call updated successfully',
      data: call,
    });
  } catch (error) {
    console.error('Error updating call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update call',
    });
  }
};