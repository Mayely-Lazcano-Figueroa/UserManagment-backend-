import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
/////////////////////////////
import requesterRoutes from '../modules/health/health.routes'; // o la ruta que corresponda
/////////////////////////////
const router = Router();

router.use('/api', HealthRoutes);
/////////////////////////////
router.use('/api', requesterRoutes);
/////////////////////////////
router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default router;
