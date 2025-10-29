import { Queue } from 'bullmq';

const connection = process.env.REDIS_URL ? { connection: { url: process.env.REDIS_URL } } : {};

export const syncQueue = new Queue('sync-queue', connection as any);
export const reminderQueue = new Queue('reminder-queue', connection as any);

export async function addRepeatableJobs() {
    await syncQueue.add('sync-all', {}, { repeat: { every: 1000 * 60 * 60 } });
    await reminderQueue.add('reminder-check', {}, { repeat: { every: 1000 * 60 * 60 } });
}
