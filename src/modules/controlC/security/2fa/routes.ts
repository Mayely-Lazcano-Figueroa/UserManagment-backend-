// src/modules/controlC/security/2fa/routes.ts
import { Router } from 'express';
import { generate, verify, disable } from './controller';
import { verifyJWT } from '../../HU3/google/controller'; // ya tienes este middleware

const router = Router();

router.post('/generate', verifyJWT, generate);
router.post('/verify', verifyJWT, verify);
router.post('/disable', verifyJWT, disable);

export default router;
