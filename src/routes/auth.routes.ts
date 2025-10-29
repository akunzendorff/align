import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { CoupleController } from '../controllers/couple.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();
const coupleController = new CoupleController();

// Rotas de autenticação
router.post('/registro', authController.register);
router.post('/login', authController.login);

// Rotas de casal (protegidas)
router.post('/casal/convite', authMiddleware, coupleController.sendInvite);
router.post('/casal/aceite', authMiddleware, coupleController.acceptInvite);

export default router;