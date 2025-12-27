// src/routes/products.routes.js
import { Router } from 'express';
import {
  // Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Products
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCreateProduct,
  validateUpdateProduct,
} from '../validators/products.validator.js';
import {
  authenticate,
  requireAdminOrSupervisor,
} from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== CATEGORIES ====================

/**
 * GET /api/products/categories
 * Listar todas las categorías
 */
router.get('/categories', getAllCategories);

/**
 * GET /api/products/categories/:id
 * Obtener una categoría específica
 */
router.get('/categories/:id', getCategoryById);

/**
 * POST /api/products/categories
 * Crear nueva categoría (requiere admin/supervisor)
 */
router.post('/categories', requireAdminOrSupervisor, validateCreateCategory, createCategory);

/**
 * PUT /api/products/categories/:id
 * Actualizar categoría (requiere admin/supervisor)
 */
router.put('/categories/:id', requireAdminOrSupervisor, validateUpdateCategory, updateCategory);

/**
 * DELETE /api/products/categories/:id
 * Eliminar categoría (requiere admin/supervisor)
 */
router.delete('/categories/:id', requireAdminOrSupervisor, deleteCategory);

// ==================== PRODUCTS ====================

/**
 * GET /api/products
 * Listar todos los productos
 */
router.get('/', getAllProducts);

/**
 * GET /api/products/:id
 * Obtener un producto específico
 */
router.get('/:id', getProductById);

/**
 * POST /api/products
 * Crear nuevo producto (requiere admin/supervisor)
 */
router.post('/', requireAdminOrSupervisor, validateCreateProduct, createProduct);

/**
 * PUT /api/products/:id
 * Actualizar producto (requiere admin/supervisor)
 */
router.put('/:id', requireAdminOrSupervisor, validateUpdateProduct, updateProduct);

/**
 * DELETE /api/products/:id
 * Eliminar producto (requiere admin/supervisor)
 */
router.delete('/:id', requireAdminOrSupervisor, deleteProduct);

export default router;