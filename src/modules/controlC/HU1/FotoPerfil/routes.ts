// src/modules/controlC/HU1/usuario/routes.ts
import { Router } from 'express';
// 💡 DEBES CREAR ESTA FUNCIÓN DEL CONTROLADOR EN EL SIGUIENTE PASO
import { updateProfilePhoto } from './controller';

const router = Router();

// 💡 RUTA NECESARIA: Maneja la petición PUT a /api/controlC/usuarios/foto
router.put('/usuarios/foto', updateProfilePhoto);

export default router;
