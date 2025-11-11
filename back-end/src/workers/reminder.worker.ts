import { Worker, Job } from 'bullmq';
import { ReminderService } from '../services/reminder.service';
import { redisConnection } from '../queues/config';

const QUEUE_NAME = 'reminders';

/**
 * Worker para processar jobs da fila de lembretes.
 * Este worker é responsável por invocar o serviço que verifica e envia
 * notificações de lembrete para os usuários.
 */
const reminderWorker = new Worker(QUEUE_NAME, async (job: Job) => {
    console.log(`[${QUEUE_NAME}] Processing job #${job.id}`);
    try {
        const reminderService = new ReminderService();
        await reminderService.checkAndSendReminders();
        console.log(`[${QUEUE_NAME}] Job #${job.id} completed.`);
        return { status: 'Completed' };
    } catch (error: any) {
        console.error(`[${QUEUE_NAME}] Job #${job.id} failed with error: ${error.message}`);
        // Re-lança o erro para que o BullMQ possa tratar a falha (ex: tentar novamente)
        throw error;
    }
}, { connection: redisConnection });

reminderWorker.on('completed', (job: Job) => {
    console.log(`[${QUEUE_NAME}] Job #${job.id} has been completed.`);
});

reminderWorker.on('failed', (job: Job | undefined, err: Error) => {
    const jobId = job ? job.id : 'unknown';
    console.error(`[${QUEUE_NAME}] Job #${jobId} has failed with error: ${err.message}`);
});

console.log('Reminder worker started and listening for jobs.');

export default reminderWorker;