import crypto from 'crypto';

export class Encryption {
    private static algorithm = 'aes-256-cbc';
    private static keyLength = 32; // 256 bits
    private static ivLength = 16; // 128 bits

    private static getKey(): Buffer {
        const key = process.env.ENCRYPTION_KEY;
        if (!key) {
            throw new Error('ENCRYPTION_KEY não está configurado');
        }
        return crypto.scryptSync(key, 'salt', this.keyLength);
    }

    public static encrypt(text: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.getKey(),
            iv
        );

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Combine IV and encrypted data
        return [
            iv.toString('hex'),
            encrypted
        ].join(':');
    }

    public static decrypt(encryptedText: string): string {
        const [ivHex, encrypted] = encryptedText.split(':');

        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.getKey(),
            Buffer.from(ivHex, 'hex')
        );

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    public static hash(text: string): string {
        return crypto
            .createHash('sha256')
            .update(text)
            .digest('hex');
    }
}