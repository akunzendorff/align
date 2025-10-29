import { Worker } from 'bullmq';
import { ReminderService } from '../services/reminder.service';

const connection = process.env.REDIS_URL ? { connection: { url: process.env.REDIS_URL } } : {};

const worker = new Worker(
    'reminder-queue',
    async () => {
        const svc = new ReminderService();
        await svc.checkAndSendReminders();
    },
    connection as any,
);

worker.on('completed', job => console.log('Reminder job completed', job.id));
worker.on('failed', (job, err) => console.error('Reminder job failed', job?.id, err));

export default worker;
