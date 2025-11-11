import { Queue } from 'bullmq';
import { redisConnection } from './config';

// Define as filas da aplicação
export const remindersQueue = new Queue('reminders', { connection: redisConnection });
export const syncQueue = new Queue('sync-queue', { connection: redisConnection });

/**
 * Adiciona jobs repetitivos ao BullMQ.
 * Esta função deve ser chamada na inicialização do servidor.
 */
export async function addRepeatableJobs() {
  console.log('Agendando jobs repetitivos...');

  // Job para verificar lembretes a cada hora
  await remindersQueue.add(
    'check-reminders', // Nome do job
    {}, // Dados do job (vazio neste caso)
    {
      repeat: {
        pattern: '0 * * * *', // Executa no minuto 0 de cada hora (padrão cron)
      },
      jobId: 'hourly-reminder-check', // ID único para evitar duplicação
    }
  );

  // Job para sincronizar contas bancárias uma vez por dia, à 1h da manhã.
  await syncQueue.add(
    'sync-all-accounts',
    {},
    {
      repeat: {
        pattern: '0 1 * * *', // Padrão cron para "às 01:00"
      },
      jobId: 'daily-sync',
    }
  );

  console.log('Jobs repetitivos agendados com sucesso.');
}
