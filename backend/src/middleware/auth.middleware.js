// src/middleware/auth.middleware.js
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../lib/prisma.js';

/**
 * Middleware para verificar que el usuario está autenticado
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    console.log('🔑 Token decoded:', decoded); // ← AGREGAR

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token or expired token' });
    }

    // Obtener información adicional del usuario desde la BD
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      include: {
        role: true,
      },
    });

    console.log('👤 User found:', user ? user.id : 'NOT FOUND'); // ← AGREGAR

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Agregar info del usuario al request
    req.user = {
      ...decoded,
      role: user.role?.name || 'user',
    };

    console.log('✅ req.user:', req.user); // ← AGREGAR
    
    next();
  } catch (error) {
    console.error('❌ Auth error:', error); // ← AGREGAR
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware para verificar que el usuario es admin o supervisor
 */
export const requireAdminOrSupervisor = (req, res, next) => {
  
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  const allowedRoles = ['admin', 'supervisor', 'administrador'];
  const userRole = req.user.role.toLowerCase();

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      error: 'Insufficient permissions. Admin or Supervisor role required.',
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario es admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  if (req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({
      error: 'Insufficient permissions. Admin role required.',
    });
  }

  next();
};