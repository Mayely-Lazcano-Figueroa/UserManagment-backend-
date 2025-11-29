import { Router } from 'express';
import {
  registrarDispositivo,
  obtenerDispositivos,
  eliminarDispositivo,
  ///device.controller
} from '../../controllers/userManagement/device.controller';
import { eliminarTodasExceptoActual } from '../../controllers/userManagement/device.controller';

const router = Router();

router.post('/register', registrarDispositivo);
router.get('/:userId', obtenerDispositivos);
router.delete('/:id', eliminarDispositivo);
router.delete('/all/:userId', eliminarTodasExceptoActual);

export default router;
