// src/routes/roles.routes.js
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        error: 'Company ID is required',
      });
    }

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