import { Worker } from 'bullmq';
import { SyncService } from '../services/sync.service';

const connection = process.env.REDIS_URL ? { connection: { url: process.env.REDIS_URL } } : {};

const worker = new Worker(
    'sync-queue',
    async (_job) => {
        const svc = new SyncService();
        await svc.syncAll();
    },
    connection as any,
);

worker.on('completed', job => console.log('Sync job completed', job.id));
worker.on('failed', (job, err) => console.error('Sync job failed', job?.id, err));

export default worker;
