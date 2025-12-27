import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const schedules = await prisma.schedules.findMany({
      where: {
        company_id: companyId,
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;