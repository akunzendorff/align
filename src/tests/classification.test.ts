import { ClassificationService } from '../services/classification.service';

describe('ClassificationService (smoke)', () => {
    it('should instantiate and not crash', async () => {
        const svc = new ClassificationService();
        expect(svc).toBeDefined();
    });
});
