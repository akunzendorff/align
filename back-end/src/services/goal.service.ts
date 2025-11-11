import { getRepository } from 'typeorm';
import { Goal } from '../models/Goal';
import { AppError } from '../utils/AppError';

export class GoalService {
  /**
   * Adiciona um valor ao progresso atual de uma meta.
   *
   * @param goalId O ID da meta a ser atualizada.
   * @param amount O valor a ser adicionado ao progresso atual.
   * @param coupleId O ID do casal para garantir o isolamento de tenant.
   * @returns A meta atualizada.
   */
  async addProgress(goalId: string, amount: number, coupleId: string): Promise<Goal> {
    const goalRepository = getRepository(Goal);

    // Busca a meta e sua relação com o casal para validação de permissão.
    const goal = await goalRepository.findOne({
      where: { id: goalId },
      relations: ['couple'],
    });

    // Validações de negócio
    if (!goal) {
      throw new AppError('Meta não encontrada.', 404);
    }

    if (goal.couple.id !== coupleId) {
      throw new AppError('Você não tem permissão para atualizar esta meta.', 403);
    }

    if (amount <= 0) {
      throw new AppError('O valor a ser adicionado deve ser positivo.', 400);
    }

    goal.currentAmount = (goal.currentAmount || 0) + amount;

    return goalRepository.save(goal);
  }
}