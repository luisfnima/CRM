import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const companyId = req.user?.companyId;
/**
 * GET /api/roles
 * Listar todos los roles
 * Query params: active (true/false), role_type (admin, supervisor, backoffice, agent)
 */
router.get('/', getAllRoles);

    const roles = await prisma.roles.findMany({
      where: {
        company_id: companyId,
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;