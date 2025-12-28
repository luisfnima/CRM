import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const branches = await prisma.branches.findMany({
      where: {
        company_id: companyId,
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;