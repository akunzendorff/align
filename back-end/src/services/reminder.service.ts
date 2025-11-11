import { getRepository, Between } from 'typeorm';
import { Task } from '../models/Task';
import { NotificationService } from './notification.service';
import { User } from '../models/User';

/**
 * ReminderService: verifica tarefas próximas do vencimento e envia notificações
 * Implementação simples com setInterval; para produção, prefira um agendador/queue.
 */
export class ReminderService {
    notification: NotificationService;

    constructor() {
        this.notification = new NotificationService();
    }

    async checkAndSendReminders() {
        const repo = getRepository(Task);
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        // Busca tarefas não concluídas que vencem EXATAMENTE na próxima hora.
        const tasks = await repo.find({ 
            where: { 
                completed: false, 
                dueDate: Between(now, oneHourFromNow) 
            }, 
            relations: ['assignedTo', 'couple'] 
        });

        for (const t of tasks) {
            if (t.assignedTo) {
                // O 'as any' não é necessário se a relação 'assignedTo' estiver corretamente tipada como User.
                await this.notification.sendUserNotification(t.assignedTo, `Lembrete: ${t.title}`, `Sua tarefa "${t.title}" vence na próxima hora!`);
            }
        }
    }
}
