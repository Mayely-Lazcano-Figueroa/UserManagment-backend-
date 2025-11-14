// src/modules/controlC/security/sesion2fa/routes.ts
import { Router } from 'express';
import { checkTwoFactorStatusController } from './controller';

const router = Router();

router.post('/check-status', checkTwoFactorStatusController);

export default router;

