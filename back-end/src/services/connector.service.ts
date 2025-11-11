import axios from 'axios';
import { BankConnection } from '../models/BankConnection';

/**
 * ConnectorService: responsável por comunicar com a API intermediária (sua API)
 * Recebe um BankConnection (contendo tokens) e faz chamadas para obter saldos, transações e cartões.
 */
export class ConnectorService {
    constructor(private baseUrl: string = process.env.EXTERNAL_API_BASE_URL || '') {}

    private getAuthHeaders(connection: BankConnection) {
        return {
            Authorization: `Bearer ${connection.accessToken}`,
        };
    }

    async fetchBalances(connection: BankConnection) {
        const url = `${this.baseUrl}/balances`;
        const resp = await axios.get(url, { headers: this.getAuthHeaders(connection) });
        return resp.data;
    }

    async fetchTransactions(connection: BankConnection, since?: string) {
        const url = `${this.baseUrl}/transactions`;
        const params: any = {};
        if (since) params.since = since;
        const resp = await axios.get(url, { headers: this.getAuthHeaders(connection), params });
        return resp.data;
    }

    async fetchCards(connection: BankConnection) {
        const url = `${this.baseUrl}/cards`;
        const resp = await axios.get(url, { headers: this.getAuthHeaders(connection) });
        return resp.data;
    }
}
