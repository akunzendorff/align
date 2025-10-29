import axios from 'axios';
import { getRepository } from 'typeorm';
import { BankConnection } from '../models/BankConnection';

export class TokenService {
    constructor(private baseUrl: string = process.env.EXTERNAL_API_BASE_URL || '') {}

    async refreshAccessToken(connection: BankConnection): Promise<BankConnection> {
        // Chama a API intermediária para renovar o token
        const url = `${this.baseUrl}/oauth/refresh`;
        const resp = await axios.post(url, { refreshToken: connection.refreshToken });

        const data = resp.data;
        if (!data || !data.accessToken) throw new Error('Refresh failed');

        const repo = getRepository(BankConnection);
        connection.accessToken = data.accessToken;
        connection.refreshToken = data.refreshToken || connection.refreshToken;
        connection.tokenExpiresAt = data.expiresAt ? new Date(data.expiresAt) : connection.tokenExpiresAt;

        await repo.save(connection);
        return connection;
    }
}
