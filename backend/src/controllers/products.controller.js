// src/controllers/products.controller.js
import { prisma } from '../lib/prisma.js';

// ==================== CATEGORIES ====================

/**
 * GET /api/categories
 * Listar todas las categorías
 */
export const getAllCategories = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { active } = req.query;

    const where = {
      company_id: companyId,
      ...(active !== undefined && { active: active === 'true' }),
    };

    const categories = await prisma.categories.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        display_order: 'asc',
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
};

/**
 * GET /api/categories/:id
 * Obtener una categoría específica
 */
export const getCategoryById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const category = await prisma.categories.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      include: {
        products: {
          where: { active: true },
          select: {
            id: true,
            code: true,
            name: true,
            price: true,
            commitment_months: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
    });
  }
};

/**
 * POST /api/categories
 * Crear nueva categoría
 */
export const createCategory = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { name, description, parent_id, display_order = 0, active = true } = req.body;

    const category = await prisma.categories.create({
      data: {
        company_id: companyId,
        name,
        description: description || null,
        parent_id: parent_id || null,
        display_order,
        active,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to create category',
      details: error.message, // Agregado temporalmente para debug
    });
  }
};

/**
 * PUT /api/categories/:id
 * Actualizar categoría
 */
export const updateCategory = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const { name, description, parent_id, display_order, active } = req.body;

    const existingCategory = await prisma.categories.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (parent_id !== undefined) updateData.parent_id = parent_id;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (active !== undefined) updateData.active = active;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
    });
  }
};

/**
 * DELETE /api/categories/:id
 * Eliminar categoría (soft delete)
 */
export const deleteCategory = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const existingCategory = await prisma.categories.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
    });
  }
};

// ==================== PRODUCTS ====================

/**
 * GET /api/products
 * Listar todos los productos
 */
export const getAllProducts = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { category_id, active, limit = 100, offset = 0 } = req.query;

    const where = {
      company_id: companyId,
      ...(category_id && { category_id: parseInt(category_id) }),
      ...(active !== undefined && { active: active === 'true' }),
    };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.products.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
};

/**
 * GET /api/products/:id
 * Obtener un producto específico
 */
export const getProductById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const product = await prisma.products.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
};

/**
 * POST /api/products
 * Crear nuevo producto
 */
export const createProduct = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      category_id,
      code,
      name,
      description,
      price,
      commitment_months,
      active = true,
      metadata,
    } = req.body;

    const product = await prisma.products.create({
      data: {
        company_id: companyId,
        category_id: category_id || null,
        code: code || null,
        name,
        description: description || null,
        price,
        commitment_months,
        active,
        metadata: metadata || null,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
};

/**
 * PUT /api/products/:id
 * Actualizar producto
 */
export const updateProduct = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const {
      category_id,
      code,
      name,
      description,
      price,
      commitment_months,
      active,
      metadata,
    } = req.body;

    const existingProduct = await prisma.products.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const updateData = {};
    if (category_id !== undefined) updateData.category_id = category_id;
    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (commitment_months !== undefined) updateData.commitment_months = commitment_months;
    if (active !== undefined) updateData.active = active;
    if (metadata !== undefined) updateData.metadata = metadata;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const product = await prisma.products.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
};

/**
 * DELETE /api/products/:id
 * Eliminar producto (soft delete)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;

    const existingProduct = await prisma.products.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const product = await prisma.products.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
};