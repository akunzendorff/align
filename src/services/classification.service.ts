import { getRepository } from 'typeorm';
import { Category } from '../models/Category';

/**
 * ClassificationService: motor simples por palavras-chave para categorizar transações
 */
export class ClassificationService {
    // Básico: busca categorias por palavras-chave no nome
    async classifyTransactionDescription(coupleId: string, description: string) {
        const repo = getRepository(Category);
        const cats = await repo.find({ where: { couple: { id: coupleId } }, relations: ['couple'] });

        const text = (description || '').toLowerCase();
        // Prioriza categorias do casal; se não houver match, retorna undefined
        for (const c of cats) {
            if (c.name && text.includes(c.name.toLowerCase())) return c;
            if (c.description && text.includes(c.description.toLowerCase())) return c;
        }

        // Se não encontrou, tenta categorias padrão
        const defaults = await repo.find({ where: { isDefault: true } });
        for (const d of defaults) {
            if (d.name && text.includes(d.name.toLowerCase())) return d;
        }

        return undefined;
    }
}
