import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { CategoryController } from '../controllers/category.controller';
import { GoalController } from '../controllers/goal.controller';
import { AllocationController } from '../controllers/allocation.controller';

const router = Router();
const categoryController = new CategoryController();
const goalController = new GoalController();
const allocationController = new AllocationController();

// Categories
router.get('/categories', authMiddleware, categoryController.list);
router.post('/categories', authMiddleware, categoryController.create);
router.put('/categories/:id', authMiddleware, categoryController.update);
router.delete('/categories/:id', authMiddleware, categoryController.remove);

// Goals
router.post('/metas', authMiddleware, goalController.create);
router.get('/metas', authMiddleware, goalController.list);
router.get('/metas/:id/progresso', authMiddleware, goalController.progress);

// Allocation rules
router.get('/alocacoes', authMiddleware, allocationController.list);
router.post('/alocacoes', authMiddleware, allocationController.create);
router.put('/alocacoes/:id', authMiddleware, allocationController.update);
router.delete('/alocacoes/:id', authMiddleware, allocationController.remove);

export default router;
