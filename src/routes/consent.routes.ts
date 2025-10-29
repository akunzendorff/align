import { Router } from 'express';
import { ConsentController } from '../controllers/ConsentController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const consentController = new ConsentController();

// Record consent
router.post('/consent', authMiddleware, consentController.recordConsent);

// Revoke specific consent
router.post('/consent/:type/revoke', authMiddleware, consentController.revokeConsent);

// Delete user data (Right to be forgotten)
router.delete('/user/data', authMiddleware, consentController.deleteUserData);

export default router;