import { NormalizationService } from '../services/normalization.service';

describe('NormalizationService', () => {
    const svc = new NormalizationService();

    it('should normalize a common raw transaction', () => {
        const raw = {
            id: 'tx_1',
            amount: '-123.45',
            description: 'Uber trip',
            date: '2025-10-01T12:00:00Z',
            account_id: 'acc_123'
        };

        const n = svc.normalizeTransaction(raw as any);
        expect(n.externalId).toBe('tx_1');
        expect(n.amount).toBeCloseTo(-123.45);
        expect(n.description).toContain('Uber');
        expect(n.accountExternalId).toBe('acc_123');
    });
});
