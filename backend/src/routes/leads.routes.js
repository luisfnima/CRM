// src/routes/leads.routes.js
import { Router } from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  importLeads,
  getLeadLists,
  getLeadListById,
  assignLeadToCampaign,
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
} from '../controllers/leads.controller.js';
import {
  validateCreateLead,
  validateUpdateLead,
  validateImportLeads,
  validateAssignLead,
  validateAddToBlacklist,
} from '../validators/leads.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * GET /api/leads
 * Listar todos los leads
 */
router.get('/', getAllLeads);

/**
 * GET /api/leads/:id
 * Obtener un lead específico
 */
router.get('/:id', getLeadById);

/**
 * POST /api/leads
 * Crear lead manual
 */
router.post('/', validateCreateLead, createLead);

/**
 * PUT /api/leads/:id
 * Actualizar lead
 */
router.put('/:id', validateUpdateLead, updateLead);

/**
 * DELETE /api/leads/:id
 * Eliminar lead (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteLead);

/**
 * POST /api/leads/import
 * Importar leads desde Excel/CSV (requiere admin/supervisor)
 */
router.post('/import', requireAdminOrSupervisor, validateImportLeads, importLeads);

/**
 * GET /api/leads/lists
 * Listar listas importadas
 */
router.get('/lists', getLeadLists);

/**
 * GET /api/leads/lists/:id
 * Ver lista importada específica
 */
router.get('/lists/:id', getLeadListById);

/**
 * POST /api/leads/:id/assign
 * Asignar lead a campaña
 */
router.post('/:id/assign', validateAssignLead, assignLeadToCampaign);

/**
 * GET /api/blacklist
 * Listar números bloqueados
 */
router.get('/blacklist', getBlacklist);

/**
 * POST /api/blacklist
 * Agregar número a blacklist (requiere admin/supervisor)
 */
router.post('/blacklist', requireAdminOrSupervisor, validateAddToBlacklist, addToBlacklist);

/**
 * DELETE /api/blacklist/:id
 * Quitar número de blacklist (requiere admin/supervisor)
 */
router.delete('/blacklist/:id', requireAdminOrSupervisor, removeFromBlacklist);

export default router;