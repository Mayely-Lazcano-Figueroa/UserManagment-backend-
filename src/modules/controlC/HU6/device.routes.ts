import { Router } from 'express';
import { getDevices, registerDevice, logoutDevice, closeOtherSessions } from './device.controller';

const router = Router();

router.get('/:userId', getDevices);
router.post('/register', registerDevice);
router.post('/logout', logoutDevice);
router.post('/close-others', closeOtherSessions);

export default router;
