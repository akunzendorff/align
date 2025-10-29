/**
 * NormalizationService: transforma diferentes formatos de transações para o formato do sistema.
 */
export class NormalizationService {
    normalizeTransaction(raw: any) {
        // Mapeamento comum (adapte conforme a resposta da sua API intermediária)
        return {
            accountExternalId: raw.account_id || raw.accountExternalId || raw.account || null,
            externalId: raw.id || raw.transaction_id || null,
            amount: Number(raw.amount),
            description: raw.description || raw.memo || raw.title || '',
            type: (raw.type === 'credit' || raw.amount > 0) ? 'credit' : 'debit',
            transactionDate: raw.date ? new Date(raw.date) : new Date(raw.timestamp),
            merchantName: raw.merchant || raw.counterparty || null
        };
    }

    normalizeTransactions(rawList: any[]) {
        return rawList.map(r => this.normalizeTransaction(r));
    }
}
