import { getRepository, MoreThan } from 'typeorm';
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
        // tarefas com dueDate nas próximas 24 horas e não concluídas
        const tasks = await repo.find({ where: { completed: false, dueDate: MoreThan(now) }, relations: ['assignedTo', 'couple'] });

        for (const t of tasks) {
            if (!t.dueDate) continue;
            const timeDiff = t.dueDate.getTime() - now.getTime();
            // se dentro de 24h
            if (timeDiff > 0 && timeDiff <= 1000 * 60 * 60 * 24) {
                // enviar lembrete para assignedTo (se existir) e para ambos membros do casal
                if (t.assignedTo) {
                    const user: User = t.assignedTo as any;
                    await this.notification.sendUserNotification(user, `Lembrete: ${t.title}`, `Tarefa "${t.title}" vence em ${t.dueDate.toISOString()}`);
                }
            }
        }
    }

    start(intervalMs = 1000 * 60 * 60) {
        // checa a cada hora
        this.checkAndSendReminders().catch(console.error);
        setInterval(() => this.checkAndSendReminders().catch(console.error), intervalMs);
    }
}
