import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { TaskController } from '../controllers/task.controller';
import { RewardController } from '../controllers/reward.controller';

const router = Router();
const taskController = new TaskController();
const rewardController = new RewardController();

// Tasks
router.get('/tasks', authMiddleware, taskController.list);
router.post('/tasks', authMiddleware, taskController.create);
router.put('/tasks/:id', authMiddleware, taskController.update);
router.delete('/tasks/:id', authMiddleware, taskController.remove);
router.post('/tasks/:id/assign', authMiddleware, taskController.assign);

// Rewards
router.get('/rewards', authMiddleware, rewardController.list);
router.post('/rewards', authMiddleware, rewardController.create);
router.post('/rewards/:id/evaluate', authMiddleware, rewardController.evaluate);

export default router;
