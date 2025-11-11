import { getRepository } from 'typeorm';
import { BankConnection } from '../models/BankConnection';
import { Transaction } from '../models/Transaction';
import { ConnectorService } from './connector.service';
import { NormalizationService } from './normalization.service';
import { TokenService } from './token.service';

/**
 * SyncService: serviço simples de background para sincronizar conexões bancárias
 * Observação: implementa um agendador por setInterval. Em produção, prefira filas (BullMQ/Rabbit) e workers.
 */
export class SyncService {
    connector: ConnectorService;
    normalizer: NormalizationService;
    tokenService: TokenService;

    constructor() {
        this.connector = new ConnectorService();
        this.normalizer = new NormalizationService();
        this.tokenService = new TokenService();
    }

    async runOnceForConnection(conn: BankConnection) {
        try {
            if (conn.tokenExpiresAt && new Date() > new Date(conn.tokenExpiresAt)) {
                await this.tokenService.refreshAccessToken(conn);
            }

            const rawTx = await this.connector.fetchTransactions(conn);
            const normalized = this.normalizer.normalizeTransactions(rawTx || []);
            const txRepo = getRepository(Transaction);
            const accountRepo = getRepository('BankAccount');

            for (const n of normalized) {
                if (n.externalId) {
                    const exists = await txRepo.findOne({ where: { externalId: n.externalId } as any });
                    if (exists) continue;
                }

                // tentar mapear conta pelo externalAccountId
                let bankAccountRef: any = undefined;
                if (n.accountExternalId) {
                    // accountRepo is a generic repository; use findOne by externalAccountId
                    const ba = await (accountRepo as any).findOne({ where: { externalAccountId: n.accountExternalId } });
                    if (ba) bankAccountRef = ba;
                }

                const txData: any = {
                    externalId: n.externalId,
                    amount: n.amount,
                    description: n.description,
                    type: n.type,
                    transactionDate: n.transactionDate,
                    merchantName: n.merchantName,
                };

                if (bankAccountRef) {
                    txData.bankAccount = bankAccountRef;
                }

                const tx = txRepo.create(txData as any);
                await txRepo.save(tx);
            }
        } catch (err) {
            console.error('Error syncing connection', conn.id, err.message || err);
        }
    }

    async syncAll() {
        const repo = getRepository(BankConnection);
        const conns = await repo.find({ relations: ['user'] });
        for (const c of conns) {
            await this.runOnceForConnection(c);
        }
    }

    start(intervalMs = 1000 * 60 * 60 * 24) {
        // intervalMs default: 24h
        this.syncAll().catch(err => console.error(err));
        setInterval(() => this.syncAll().catch(err => console.error(err)), intervalMs);
    }
}
