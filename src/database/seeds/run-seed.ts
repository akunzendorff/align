import { createConnection } from 'typeorm';
import runInitialSeed from './create-initial-data.seed';

async function runSeed() {
    const connection = await createConnection();
    console.log('Database connected');

    try {
        await runInitialSeed(connection);
        console.log('Seed completed successfully');
    } catch (error) {
        console.error('Error running seed:', error);
    } finally {
        await connection.close();
    }
}

runSeed()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });