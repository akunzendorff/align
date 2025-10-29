import nodemailer from 'nodemailer';
import { User } from '../models/User';
import admin from 'firebase-admin';

/**
 * NotificationService: sends emails (nodemailer) and push (Firebase) when configured.
 * - Email: requires SMTP_* env variables
 * - Push: requires FIREBASE_SERVICE_ACCOUNT JSON in env or path
 */
export class NotificationService {
    private transporter: any | null = null;
    private firebaseInitialized = false;

    constructor() {
        if (process.env.SMTP_HOST) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }

        // Initialize Firebase admin if a service account is provided
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            try {
                const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({ credential: admin.credential.cert(svc as any) });
                this.firebaseInitialized = true;
            } catch (err) {
                console.warn('Failed to init firebase-admin from FIREBASE_SERVICE_ACCOUNT:', err.message || err);
            }
        }
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        if (!this.transporter) {
            console.log(`[Notification] Email to=${to} subject=${subject} text=${text}`);
            return;
        }

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
            html,
        });
    }

    async sendPush(toDeviceToken: string, title: string, body: string) {
        if (!this.firebaseInitialized) {
            console.log(`[Notification] push to=${toDeviceToken} title=${title} body=${body}`);
            return;
        }

        const message = {
            token: toDeviceToken,
            notification: { title, body },
        };

        await admin.messaging().send(message as any);
    }

    async sendUserNotification(user: User & { deviceToken?: string }, title: string, body: string) {
        if (user.email) {
            await this.sendEmail(user.email, title, body);
        }
        if (user.deviceToken) {
            await this.sendPush(user.deviceToken, title, body);
        }
    }
}
