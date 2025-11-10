// src/modules/controlC/HU6/device.routes.ts
import { Router } from 'express';
import { getDevices, logoutDevice, registerDevice } from './device.controller';

const router = Router();

router.post('/register', registerDevice); // registrar dispositivo al login
router.get('/', getDevices); // obtener dispositivos de un usuario
router.delete('/:deviceId', logoutDevice); // cerrar sesión en un dispositivo

export default router;
